import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de Overview
app.get('/api/overview', async (req, res) => {
  try {
    // Busca o primeiro usuário para fins de exemplo
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .limit(1)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const userId = user.id;

    // Busca dados em paralelo
    const [transactionsResp, potsResp, budgetsResp] = await Promise.all([
      supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(5),
      supabase
        .from('pots')
        .select('*')
        .eq('user_id', userId),
      supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
    ]);

    res.json({ 
      balance: user.current_balance, 
      latestTransactions: transactionsResp.data, 
      pots: potsResp.data, 
      budgets: budgetsResp.data 
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados do dashboard" });
  }
});

// Outras rotas seriam expandidas aqui...

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
