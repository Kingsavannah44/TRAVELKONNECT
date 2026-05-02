const supabase = require('../config/supabase');

class Job {
  constructor(data) {
    Object.assign(this, data);
  }

  static supabaseFromJobs() {
    return supabase.from('jobs');
  }

  static async create(jobData) {
    const { data, error } = await supabase
      .from('jobs')
      .insert([{ ...jobData, created_at: new Date(), updated_at: new Date() }])
      .select()
      .single();
    if (error) throw error;
    return new Job(data);
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return new Job(data);
  }

  static async find(query = {}) {
    let supabaseQuery = supabase.from('jobs').select('*');

    if (query.status) {
      supabaseQuery = supabaseQuery.eq('status', query.status);
    }

    // Add more filters as needed for location, requirements, etc.
    // For complex queries, may need custom implementation

    const { data, error } = await supabaseQuery;
    if (error) throw error;
    return data.map(job => new Job(job));
  }

  static async countDocuments(query = {}) {
    let supabaseQuery = supabase.from('jobs').select('*', { count: 'exact', head: true });

    if (query.status) {
      supabaseQuery = supabaseQuery.eq('status', query.status);
    }

    const { count, error } = await supabaseQuery;
    if (error) throw error;
    return count;
  }

  static async findOne(query) {
    let supabaseQuery = supabase.from('jobs').select('*');

    if (query._id) {
      supabaseQuery = supabaseQuery.eq('id', query._id);
    }
    if (query.employer) {
      supabaseQuery = supabaseQuery.eq('employer', query.employer);
    }

    const { data, error } = await supabaseQuery.single();
    if (error && error.code !== 'PGRST116') throw error;
    return data ? new Job(data) : null;
  }

  static async findOneAndDelete(query) {
    const job = await this.findOne(query);
    if (job) {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', job.id);
      if (error) throw error;
      return job;
    }
    return null;
  }

  async save() {
    const isNew = !this.id;
    const { data, error } = await supabase
      .from('jobs')
      .upsert([{ ...this, updated_at: new Date() }])
      .select()
      .single();
    if (error) throw error;
    Object.assign(this, data);
    return this;
  }
}

module.exports = Job;