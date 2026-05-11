CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount_limit DECIMAL(12, 2) NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Política para que usuários vejam apenas seus próprios orçamentos
CREATE POLICY "Users can manage their own budgets" ON public.budgets
  FOR ALL USING (auth.uid() = user_id);