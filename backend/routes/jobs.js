const express = require('express');
const Job = require('../models/Job');
const { auth, authorize } = require('../middleware/auth');
const supabase = require('../config/supabase');

const router = express.Router();

// Get all jobs (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, country, experience, truckType, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let query = supabase.from('jobs').select('*', { count: 'exact' }).eq('status', 'active');
    
    if (country) {
      query = query.eq('location->>country', country);
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
          const { data: employer } = await supabase
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
    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error || !job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Get employer details
    try {
      const { data: employer } = await supabase
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
    console.log('Creating job with data:', JSON.stringify(req.body, null, 2));
    
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

    const jobData = {
      title: req.body.title,
      company: req.body.company || 'Company',
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

    const { data: job, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    console.log('Job created successfully:', job.id);
    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ 
      message: 'Failed to create job', 
      error: error.message
    });
  }
});

// Update job (employer only)
router.put('/:id', auth, authorize('employer'), async (req, res) => {
  try {
    const { data: job, error } = await supabase
      .from('jobs')
      .update({
        ...req.body,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .eq('employer', req.user.id)
      .select()
      .single();

    if (error || !job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete job (employer only)
router.delete('/:id', auth, authorize('employer'), async (req, res) => {
  try {
    const { data: job, error } = await supabase
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

    const { data: jobs, error, count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .eq('employer', req.user.id)
      .range(offset, offset + parseInt(limit) - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

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
