CREATE TABLE IF NOT EXISTS public.pots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target DECIMAL(12, 2) NOT NULL,
  total_saved DECIMAL(12, 2) DEFAULT 0.00,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.pots ENABLE ROW LEVEL SECURITY;

-- Política para que usuários gerenciem apenas suas próprias caixinhas
CREATE POLICY "Users can manage their own pots" ON public.pots
  FOR ALL USING (auth.uid() = user_id);