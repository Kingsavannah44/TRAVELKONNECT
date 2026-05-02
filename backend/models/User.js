const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create(userData) {
    console.log('Starting user creation...');
    const hashedPassword = await bcrypt.hash(userData.password, 8);
    console.log('Password hashed');

    // Transform camelCase keys to snake_case for database columns
    const toSnakeCase = (str) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    const transformedData = Object.keys(userData).reduce((acc, key) => {
      acc[toSnakeCase(key)] = userData[key];
      return acc;
    }, {});

    const { data, error } = await supabase
      .from('users')
      .insert({ ...transformedData, password: hashedPassword, created_at: new Date(), updated_at: new Date() })
      .select('id, created_at, updated_at')
      .single();
    console.log('Insert query completed');
    if (error) throw error;
    console.log('User created successfully');
    return new User({ ...userData, id: data.id, password: hashedPassword, created_at: data.created_at, updated_at: data.updated_at });
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data ? new User(data) : null;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    delete data.password;
    return new User(data);
  }

  static async find() {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error) throw error;
    return data.map(user => new User(user));
  }

  static async countDocuments(query = {}) {
    let supabaseQuery = supabase.from('users').select('*', { count: 'exact', head: true });

    if (query.role) {
      supabaseQuery = supabaseQuery.eq('role', query.role);
    }
    if (query.isActive !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_active', query.isActive);
    }

    const { count, error } = await supabaseQuery;
    if (error) throw error;
    return count;
  }

  async save() {
    const { data, error } = await supabase
      .from('users')
      .update({ ...this, updated_at: new Date() })
      .eq('id', this.id)
      .select()
      .single();
    if (error) throw error;
    Object.assign(this, data);
    return this;
  }

  static async findByIdAndUpdate(id, updateData) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updateData, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    delete data.password;
    return new User(data);
  }

  async comparePassword(candidatePassword) {
    // Try bcrypt comparison first (for hashed passwords)
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    if (isMatch) return true;

    // Fallback to plain text comparison for backward compatibility
    return candidatePassword === this.password;
  }
}

module.exports = User;