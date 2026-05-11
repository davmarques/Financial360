import { supabase } from '../lib/supabase';

export const financialService = {
  async getPots() {
    const { data, error } = await supabase
      .from('pots')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getTransactions(limit = 10) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async addTransaction(transaction) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("User not authenticated");

    let amount = Math.abs(parseFloat(transaction.amount));
    
    // Se for despesa, garante que o valor seja negativo
    if (transaction.type === 'expense') {
      amount = -amount;
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        recipient_sender: transaction.recipient_sender,
        category: transaction.category,
        amount: amount,
        date: transaction.date,
        user_id: user.id,
        type: transaction.type,
        recurring: transaction.recurring
      }])
      .select();
    
    if (error) {
      console.error("Supabase Error Details:", error);
      throw error;
    }
    return data[0];
  },

  async getBudgets() {
    const { data: budgets, error: budgetError } = await supabase
      .from('budgets')
      .select('*')
      .order('category', { ascending: true });
    
    if (budgetError) throw budgetError;

    // Para cada orçamento, calcular quanto já foi gasto com transações daquela categoria
    const { data: transactions, error: transError } = await supabase
      .from('transactions')
      .select('amount, category, recipient_sender, date')
      .eq('type', 'expense')
      .order('date', { ascending: false });

    if (transError) throw transError;

    const budgetsWithSpending = budgets.map(budget => {
      const categoryTransactions = transactions.filter(t => t.category.toLowerCase() === budget.category.toLowerCase());
      const spent = categoryTransactions.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
      
      return {
        ...budget,
        spent,
        latestTransactions: categoryTransactions.slice(0, 3)
      };
    });

    return budgetsWithSpending;
  },

  async getBalanceSummary() {
    // Nota: Em um sistema real, isso poderia ser uma view ou RPC no Supabase
    // para melhor performance. Aqui faremos o cálculo básico.
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('amount, type');
    
    if (error) throw error;

    const summary = transactions.reduce((acc, curr) => {
      const amt = parseFloat(curr.amount);
      if (curr.type === 'income') {
        acc.income += amt;
        acc.currentBalance += amt;
      } else {
        acc.expenses += amt;
        acc.currentBalance -= amt;
      }
      return acc;
    }, { currentBalance: 0, income: 0, expenses: 0 });

    return summary;
  },

  async getRecurringBills() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('recurring', true);
    
    if (error) throw error;

    const now = new Date();
    
    const paid = data.filter(b => new Date(b.date) < now).reduce((acc, b) => acc + Math.abs(parseFloat(b.amount)), 0);
    const upcoming = data.filter(b => new Date(b.date) >= now).reduce((acc, b) => acc + Math.abs(parseFloat(b.amount)), 0);
    
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    const dueSoon = data.filter(b => {
      const d = new Date(b.date);
      return d >= now && d <= nextWeek;
    }).reduce((acc, b) => acc + Math.abs(parseFloat(b.amount)), 0);

    return [
      { label: 'Paid Bills', amount: paid, color: 'border-green' },
      { label: 'Total Upcoming', amount: upcoming, color: 'border-orange' },
      { label: 'Due Soon', amount: dueSoon, color: 'border-cyan' },
    ];
  },

  async addBudget(budget) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('budgets')
      .insert([{
        category: budget.category,
        amount_limit: budget.limit,
        color: budget.color,
        user_id: user.id
      }])
      .select();

    if (error) throw error;
    return data[0];
  },

  async updateBudget(id, budget) {
    const { data, error } = await supabase
      .from('budgets')
      .update({
        category: budget.category,
        amount_limit: budget.limit,
        color: budget.color
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async deleteBudget(id) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async addPot(pot) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('pots')
      .insert([{
        name: pot.name,
        target: pot.target,
        color: pot.color,
        total_saved: 0,
        user_id: user.id
      }])
      .select();

    if (error) throw error;
    return data[0];
  },

  async updatePot(id, pot) {
    const { data, error } = await supabase
      .from('pots')
      .update({
        name: pot.name,
        target: pot.target,
        color: pot.color
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async deletePot(id) {
    const { error } = await supabase
      .from('pots')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async updatePotBalance(id, newBalance) {
    const { data, error } = await supabase
      .from('pots')
      .update({ total_saved: newBalance })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }
};
