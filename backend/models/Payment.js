const supabase = require('../config/supabase');

class Payment {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create(paymentData) {
    const transactionId = paymentData.transactionId || `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = paymentData.expiresAt || new Date(Date.now() + 10 * 60 * 1000);
    const { data, error } = await supabase
      .from('payments')
      .insert([{ ...paymentData, transactionId, expiresAt, created_at: new Date(), updated_at: new Date() }])
      .select()
      .single();
    if (error) throw error;
    return new Payment(data);
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return new Payment(data);
  }

  static async findByTransactionId(transactionId) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('transactionId', transactionId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data ? new Payment(data) : null;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('userId', userId);
    if (error) throw error;
    return data.map(payment => new Payment(payment));
  }

  static async findPendingExpired() {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('status', 'pending')
      .lt('expiresAt', new Date());
    if (error) throw error;
    return data.map(payment => new Payment(payment));
  }

  async save() {
    const { data, error } = await supabase
      .from('payments')
      .update({ ...this, updated_at: new Date() })
      .eq('id', this.id)
      .select()
      .single();
    if (error) throw error;
    Object.assign(this, data);
    return this;
  }
}

module.exports = Payment;