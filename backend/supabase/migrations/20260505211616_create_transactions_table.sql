-- Criar ENUM para o tipo de transação
DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('income', 'expense');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recipient_sender TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  type transaction_type NOT NULL,
  recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Política para que usuários gerenciem apenas suas próprias transações
CREATE POLICY "Users can manage their own transactions" ON public.transactions
  FOR ALL USING (auth.uid() = user_id);