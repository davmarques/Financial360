CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  current_balance DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (opcional, mas recomendado no Supabase)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Criar política básica para permitir que usuários vejam seus próprios dados
CREATE POLICY "Users can see their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);