const express = require('express');
const Job = require('../models/Job');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Handle CORS preflight for all routes
router.options('*', (req, res) => {
  res.status(200).send();
});

// Helper function to format job with employer info
const formatJobWithEmployer = async (job) => {
  if (!job) return null;
  
  try {
    const User = require('../models/User');
    const employer = await User.findById(job.employer);
    return {
      ...job,
      employer: employer ? {
        profile: employer.profile,
        employerProfile: employer.employer_profile
      } : null
    };
  } catch (error) {
    return { ...job, employer: null };
  }
};

// Get all jobs (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, country, experience, truckType, search } = req.query;
    
    // Build filter object
    const filter = { status: 'active' };
    
    if (country) {
      filter['location.country'] = country;
    }
    if (truckType) {
      filter['requirements.truckTypes'] = { $contains: [truckType] };
    }
    if (search) {
      filter.$or = [
        { title: { $ilike: `%${search}%` } },
        { company: { $ilike: `%${search}%` } },
        { description: { $ilike: `%${search}%` } }
      ];
    }

    // Get jobs with pagination using Supabase directly
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query for Supabase
    let query = Job.supabaseFromJobs().select('*', { count: 'exact' }).eq('status', 'active');
    
    if (country) {
      query = query.eq('location->>country', country);
    }
    if (truckType) {
      query = query.contains('requirements->truckTypes', [truckType]);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    const { data: jobs, error, count } = await query
      .range(offset, offset + parseInt(limit) - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch employer details for each job
    const jobsWithEmployer = await Promise.all(
      (jobs || []).map(async (job) => {
        try {
          const { data: employer } = await Job.supabase
            .from('users')
            .select('profile, employer_profile')
            .eq('id', job.employer)
            .single();
          
          return {
            ...job,
            employer: employer || null
          };
        } catch (err) {
          return { ...job, employer: null };
        }
      })
    );

    res.json({
      jobs: jobsWithEmployer,
      totalPages: Math.ceil((count || 0) / parseInt(limit)),
      currentPage: parseInt(page),
      total: count || 0
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Get employer details
    try {
      const { data: employer } = await Job.supabase
        .from('users')
        .select('profile, employer_profile')
        .eq('id', job.employer)
        .single();
      
      job.employer = employer || null;
    } catch (err) {
      job.employer = null;
    }

    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create job (employer only)
router.post('/', auth, authorize('employer'), async (req, res) => {
  try {
    console.log('=== JOB CREATION START ===');
    console.log('Creating job with data:', JSON.stringify(req.body, null, 2));
    console.log('User ID:', req.user.id);
    console.log('User profile:', JSON.stringify(req.user, null, 2));
    
    // Validate required fields
    if (!req.body.title || !req.body.location || !req.body.description) {
      const missing = [];
      if (!req.body.title) missing.push('title');
      if (!req.body.location) missing.push('location');
      if (!req.body.description) missing.push('description');
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['title', 'location', 'description'],
        missing
      });
    }

    // Build job data with proper field names matching schema
    const jobData = {
      title: req.body.title,
      company: req.body.company || (req.user.employer_profile?.company_name) || (req.user.profile?.first_name) || 'Company',
      employer: req.user.id,
      location: req.body.location,
      description: req.body.description,
      requirements: req.body.requirements || null,
      salary: req.body.salary || null,
      benefits: req.body.benefits || null,
      job_type: req.body.jobType || 'full-time',
      status: 'active',
      applications_count: 0,
      application_deadline: req.body.deadline || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Processed job data:', JSON.stringify(jobData, null, 2));

    // Test Supabase connection first
    try {
      const { data: testConnection, error: testError } = await Job.supabaseFromJobs().select('count').limit(1);
      if (testError) {
        console.error('Supabase connection test failed:', testError);
      } else {
        console.log('Supabase connection OK');
      }
    } catch (e) {
      console.error('Supabase connection exception:', e);
    }

    const { data: job, error } = await Job.supabaseFromJobs()
      .insert([jobData])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error, null, 2));
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      throw error;
    }

    console.log('Job created successfully:', job.id);
    console.log('=== JOB CREATION SUCCESS ===');
    res.status(201).json(job);
  } catch (error) {
    console.error('=== JOB CREATION FAILED ===');
    console.error('Error creating job:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to create job', 
      error: error.message,
      code: error.code,
      details: error.details || 'No additional details',
      hint: error.hint || 'No hint'
    });
  }
});

// Update job (employer only)
router.put('/:id', auth, authorize('employer'), async (req, res) => {
  try {
    // Check if job belongs to employer
    const existingJob = await Job.findOne({ _id: req.params.id, employer: req.user.id });
    
    if (!existingJob) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    const { data: job, error } = await Job.supabase
      .from('jobs')
      .update({
        ...req.body,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete job (employer only)
router.delete('/:id', auth, authorize('employer'), async (req, res) => {
  try {
    const { data: job, error } = await Job.supabase
      .from('jobs')
      .delete()
      .eq('id', req.params.id)
      .eq('employer', req.user.id)
      .select()
      .single();

    if (error || !job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.json({ message: 'Job deleted successfully', job });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employer's jobs
router.get('/employer/my-jobs', auth, authorize('employer'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const { count, error: countError } = await Job.supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('employer', req.user.id);

    if (countError) throw countError;

    // Get jobs with pagination
    const { data: jobs, error: jobsError } = await Job.supabase
      .from('jobs')
      .select('*')
      .eq('employer', req.user.id)
      .range(offset, offset + parseInt(limit) - 1)
      .order('created_at', { ascending: false });

    if (jobsError) throw jobsError;

    res.json({
      jobs: jobs || [],
      totalPages: Math.ceil((count || 0) / parseInt(limit)),
      currentPage: parseInt(page),
      total: count || 0
    });
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;