-- Truck Driver Platform Database Schema
-- Supabase PostgreSQL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('driver', 'employer')),
  profile JSONB,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  payment_details JSONB,
  employer_profile JSONB,
  driver_profile JSONB,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  employer UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location JSONB NOT NULL,
  description TEXT NOT NULL,
  requirements JSONB,
  salary JSONB,
  benefits JSONB,
  job_type TEXT DEFAULT 'full-time' CHECK (job_type IN ('full-time', 'part-time', 'contract')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed', 'cancelled')),
  application_deadline TIMESTAMPTZ,
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  driver UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employer UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'shortlisted', 'interview-scheduled', 'rejected', 'hired')),
  cover_letter TEXT,
  documents JSONB,
  interview JSONB,
  feedback JSONB,
  timeline JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job, driver) -- Prevent duplicate applications
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_jobs_employer ON jobs(employer);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_location_country ON jobs USING GIN ((location->'country'));
CREATE INDEX idx_jobs_requirements_experience ON jobs USING GIN ((requirements->'experience'));
CREATE INDEX idx_applications_job ON applications(job);
CREATE INDEX idx_applications_driver ON applications(driver);
CREATE INDEX idx_applications_employer ON applications(employer);
CREATE INDEX idx_applications_status ON applications(status);

-- Row Level Security (RLS) policies
-- Using application-level authentication (JWT) instead of Supabase auth
-- RLS is disabled on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Allow payment creation" ON payments;
DROP POLICY IF EXISTS "Users can view their own payments" ON payments;
DROP POLICY IF EXISTS "Allow payment updates" ON payments;
DROP POLICY IF EXISTS "Anyone can view active jobs" ON jobs;
DROP POLICY IF EXISTS "Employers can manage their own jobs" ON jobs;
DROP POLICY IF EXISTS "Drivers can view their own applications" ON applications;
DROP POLICY IF EXISTS "Employers can view applications for their jobs" ON applications;
DROP POLICY IF EXISTS "Drivers can create applications" ON applications;
DROP POLICY IF EXISTS "Employers can update applications for their jobs" ON applications;

-- Users policies
CREATE POLICY "Allow user registration" ON users
  FOR INSERT WITH CHECK (auth.role() = 'anon');

CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Payments policies
CREATE POLICY "Allow payment creation" ON payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow payment updates" ON payments
  FOR UPDATE WITH CHECK (true);

-- Jobs policies
CREATE POLICY "Anyone can view active jobs" ON jobs
  FOR SELECT USING (status = 'active');

CREATE POLICY "Employers can manage their own jobs" ON jobs
  FOR ALL USING (auth.uid() = employer);

-- Applications policies
CREATE POLICY "Drivers can view their own applications" ON applications
  FOR SELECT USING (auth.uid() = driver);

CREATE POLICY "Employers can view applications for their jobs" ON applications
  FOR SELECT USING (auth.uid() = employer);

CREATE POLICY "Drivers can create applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = driver);

CREATE POLICY "Employers can update applications for their jobs" ON applications
  FOR UPDATE USING (auth.uid() = employer);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment applications_count
CREATE OR REPLACE FUNCTION increment_applications_count(job_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE jobs SET applications_count = applications_count + 1 WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement applications_count
CREATE OR REPLACE FUNCTION decrement_applications_count(job_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE jobs SET applications_count = GREATEST(applications_count - 1, 0) WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;