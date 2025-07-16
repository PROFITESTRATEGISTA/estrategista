/*
  # Sincronizar usuários do auth.users com tabela users

  1. Função para sincronizar usuários
    - Cria trigger para sincronizar automaticamente
    - Popula dados iniciais dos usuários existentes
  
  2. Trigger automático
    - Executa quando novo usuário se registra
    - Cria entrada na tabela users automaticamente
*/

-- Função para sincronizar usuário do auth para tabela users
CREATE OR REPLACE FUNCTION sync_user_to_users_table()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, plan, is_active, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'free',
    true,
    NEW.created_at
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name),
    created_at = EXCLUDED.created_at;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para sincronização automática
DROP TRIGGER IF EXISTS sync_user_trigger ON auth.users;
CREATE TRIGGER sync_user_trigger
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_to_users_table();

-- Sincronizar usuários existentes do auth.users para a tabela users
INSERT INTO public.users (id, email, name, plan, is_active, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)) as name,
  'free' as plan,
  true as is_active,
  au.created_at
FROM auth.users au
WHERE au.email IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = COALESCE(EXCLUDED.name, users.name),
  created_at = EXCLUDED.created_at;