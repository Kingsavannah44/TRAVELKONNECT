const supabase = require('./config/supabase');
require('dotenv').config();

async function checkDatabase() {
  try {
    console.log('Checking database connection and tables...');

    // Test connection
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersError) {
      console.log('❌ Users table does not exist:', usersError.message);
    } else {
      console.log('✅ Users table exists');
    }

    // Check jobs table
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true });

    if (jobsError) {
      console.log('❌ Jobs table does not exist:', jobsError.message);
    } else {
      console.log('✅ Jobs table exists');
    }

    // Check applications table
    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true });

    if (appsError) {
      console.log('❌ Applications table does not exist:', appsError.message);
    } else {
      console.log('✅ Applications table exists');
    }

    // Check payments table
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true });

    if (paymentsError) {
      console.log('❌ Payments table does not exist:', paymentsError.message);
    } else {
      console.log('✅ Payments table exists');
    }

  } catch (error) {
    console.error('Database check failed:', error.message);
  }
}

checkDatabase();