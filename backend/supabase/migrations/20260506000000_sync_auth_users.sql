-- Migração para sincronizar auth.users com public.users
-- Esta função será disparada sempre que um novo usuário for criado no Supabase Auth

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, password_hash)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), 
    NEW.email,
    'managed-by-supabase'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para automatizar o processo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Nota: Para usuários que já existem, você pode rodar este comando manualmente uma vez:
-- INSERT INTO public.users (id, name, email, password_hash)
-- SELECT id, COALESCE(raw_user_meta_data->>'full_name', 'User'), email, 'managed-by-supabase'
-- FROM auth.users
-- ON CONFLICT (id) DO NOTHING;
