const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkTables() {
  try {
    console.log('🔍 Checking Supabase database tables...\n');

    const tables = ['users', 'jobs', 'applications', 'payments'];

    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.log(`❌ ${table} table: ${error.message}`);
        } else {
          console.log(`✅ ${table} table exists (${count} records)`);
        }
      } catch (err) {
        console.log(`❌ ${table} table: ${err.message}`);
      }
    }

    console.log('\n📋 Database Status Summary:');
    console.log('• Supabase URL:', process.env.SUPABASE_URL ? '✅ Configured' : '❌ Missing');
    console.log('• Anon Key:', process.env.SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing');
    console.log('• JWT Secret:', process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing');

  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  }
}

checkTables();