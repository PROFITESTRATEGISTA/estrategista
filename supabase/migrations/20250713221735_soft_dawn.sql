/*
  # Seed initial users for testing

  1. Insert test users
    - Admin user (Pedro Pardal)
    - Sample users with different plans
  2. Ensure proper data structure
*/

-- Insert admin user if not exists
INSERT INTO users (email, name, plan, is_active, phone)
VALUES 
  ('pedropardal04@gmail.com', 'Pedro Pardal', 'master', true, '(11) 99999-9999')
ON CONFLICT (email) DO NOTHING;

-- Insert sample users for testing
INSERT INTO users (email, name, plan, is_active, phone)
VALUES 
  ('user1@example.com', 'Usuário Teste 1', 'pro', true, '(11) 99999-1111'),
  ('user2@example.com', 'Usuário Teste 2', 'free', true, '(11) 99999-2222'),
  ('user3@example.com', 'Usuário Teste 3', 'master', false, '(11) 99999-3333'),
  ('trader@example.com', 'Trader Profissional', 'pro', true, '(11) 99999-4444'),
  ('demo@example.com', 'Usuário Demo', 'free', true, '(11) 99999-5555')
ON CONFLICT (email) DO NOTHING;