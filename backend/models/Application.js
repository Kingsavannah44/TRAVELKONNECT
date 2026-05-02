const supabase = require('../config/supabase');

class Application {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create(applicationData) {
    const { data, error } = await supabase
      .from('applications')
      .insert([{ ...applicationData, created_at: new Date(), updated_at: new Date() }])
      .select()
      .single();
    if (error) throw error;
    return new Application(data);
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return new Application(data);
  }

  static async find(query = {}) {
    let supabaseQuery = supabase.from('applications').select('*');

    if (query.job) {
      supabaseQuery = supabaseQuery.eq('job', query.job);
    }
    if (query.driver) {
      supabaseQuery = supabaseQuery.eq('driver', query.driver);
    }
    if (query.employer) {
      supabaseQuery = supabaseQuery.eq('employer', query.employer);
    }
    if (query.status) {
      supabaseQuery = supabaseQuery.eq('status', query.status);
    }

    const { data, error } = await supabaseQuery;
    if (error) throw error;
    return data.map(app => new Application(app));
  }

  static async countDocuments(query = {}) {
    let supabaseQuery = supabase.from('applications').select('*', { count: 'exact', head: true });

    if (query.job) {
      supabaseQuery = supabaseQuery.eq('job', query.job);
    }
    if (query.driver) {
      supabaseQuery = supabaseQuery.eq('driver', query.driver);
    }
    if (query.employer) {
      supabaseQuery = supabaseQuery.eq('employer', query.employer);
    }
    if (query.status) {
      supabaseQuery = supabaseQuery.eq('status', query.status);
    }

    const { count, error } = await supabaseQuery;
    if (error) throw error;
    return count;
  }

  static async findOne(query) {
    let supabaseQuery = supabase.from('applications').select('*');

    Object.keys(query).forEach(key => {
      supabaseQuery = supabaseQuery.eq(key, query[key]);
    });

    const { data, error } = await supabaseQuery.single();
    if (error && error.code !== 'PGRST116') throw error;
    return data ? new Application(data) : null;
  }

  async save() {
    const { data, error } = await supabase
      .from('applications')
      .upsert([{ ...this, updated_at: new Date() }])
      .select()
      .single();
    if (error) throw error;
    Object.assign(this, data);
    return this;
  }
}

module.exports = Application;