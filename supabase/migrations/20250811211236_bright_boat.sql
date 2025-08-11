/*
  # Sistema Financeiro - Contratos e Custos

  1. Novas Tabelas
    - `client_contracts` - Contratos dos clientes
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key para users)
      - `plan_type` (text, tipo do plano)
      - `billing_period` (text, período de cobrança)
      - `monthly_value` (numeric, valor mensal)
      - `contract_start` (date, início do contrato)
      - `contract_end` (date, fim do contrato)
      - `is_active` (boolean, contrato ativo)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `financial_costs` - Custos da empresa
      - `id` (uuid, primary key)
      - `description` (text, descrição do custo)
      - `category` (text, categoria do custo)
      - `amount` (numeric, valor do custo)
      - `cost_date` (date, data do custo)
      - `is_recurring` (boolean, custo recorrente)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_profiles` - Perfis dos usuários
      - `id` (uuid, primary key, foreign key para auth.users)
      - `full_name` (text, nome completo)
      - `email` (text, email)
      - `phone` (text, telefone)
      - `is_active` (boolean, usuário ativo)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Enable RLS em todas as tabelas
    - Políticas para admin gerenciar tudo
    - Políticas para usuários verem apenas seus dados

  3. Índices
    - Índices para performance em consultas frequentes
*/

-- Criar tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de contratos de clientes
CREATE TABLE IF NOT EXISTS client_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  plan_type text NOT NULL CHECK (plan_type IN ('bitcoin', 'mini-indice', 'mini-dolar', 'portfolio-completo')),
  billing_period text NOT NULL CHECK (billing_period IN ('monthly', 'semiannual', 'annual')),
  monthly_value numeric(10,2) NOT NULL CHECK (monthly_value > 0),
  contract_start date NOT NULL,
  contract_end date NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_contract_dates CHECK (contract_end > contract_start)
);

-- Criar tabela de custos financeiros
CREATE TABLE IF NOT EXISTS financial_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('operacional', 'marketing', 'tecnologia', 'pessoal', 'infraestrutura', 'outros')),
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  cost_date date NOT NULL,
  is_recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_costs ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
CREATE POLICY "Admin can manage all user profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'pedropardal04@gmail.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'pedropardal04@gmail.com'
    )
  );

CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Políticas para client_contracts
CREATE POLICY "Admin can manage all contracts"
  ON client_contracts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'pedropardal04@gmail.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'pedropardal04@gmail.com'
    )
  );

CREATE POLICY "Users can view own contracts"
  ON client_contracts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Políticas para financial_costs
CREATE POLICY "Admin can manage all costs"
  ON financial_costs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'pedropardal04@gmail.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'pedropardal04@gmail.com'
    )
  );

-- Service role pode gerenciar tudo
CREATE POLICY "Service role can manage user profiles"
  ON user_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage contracts"
  ON client_contracts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage costs"
  ON financial_costs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_client_contracts_user_id ON client_contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_client_contracts_is_active ON client_contracts(is_active);
CREATE INDEX IF NOT EXISTS idx_client_contracts_contract_end ON client_contracts(contract_end);
CREATE INDEX IF NOT EXISTS idx_financial_costs_cost_date ON financial_costs(cost_date);
CREATE INDEX IF NOT EXISTS idx_financial_costs_is_recurring ON financial_costs(is_recurring);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);

-- Funções para atualizar updated_at
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_client_contracts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_financial_costs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER user_profiles_updated_at_trigger
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

CREATE TRIGGER client_contracts_updated_at_trigger
  BEFORE UPDATE ON client_contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_client_contracts_updated_at();

CREATE TRIGGER financial_costs_updated_at_trigger
  BEFORE UPDATE ON financial_costs
  FOR EACH ROW
  EXECUTE FUNCTION update_financial_costs_updated_at();

-- Função para sincronizar auth.users com user_profiles
CREATE OR REPLACE FUNCTION sync_user_to_profiles()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    full_name,
    email,
    phone,
    is_active,
    created_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone),
    true,
    NEW.created_at
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    phone = COALESCE(EXCLUDED.phone, user_profiles.phone),
    full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para sincronização automática
DROP TRIGGER IF EXISTS sync_user_profiles_trigger ON auth.users;
CREATE TRIGGER sync_user_profiles_trigger
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_to_profiles();

-- Inserir dados de exemplo
INSERT INTO user_profiles (id, full_name, email, phone, is_active) VALUES
  ('admin-pedro-pardal', 'Pedro Pardal', 'pedropardal04@gmail.com', '+55 11 97533-3355', true),
  ('user-joao-silva', 'João Silva', 'joao@email.com', '+55 11 88888-8888', true),
  ('user-maria-santos', 'Maria Santos', 'maria@email.com', '+55 11 77777-7777', true),
  ('user-carlos-oliveira', 'Carlos Oliveira', 'carlos@email.com', '+55 11 66666-6666', true),
  ('user-ana-costa', 'Ana Costa', 'ana@email.com', '+55 11 55555-5555', true),
  ('user-bruno-ferreira', 'Bruno Ferreira', 'bruno@email.com', '+55 11 44444-4444', false)
ON CONFLICT (id) DO NOTHING;

-- Inserir contratos de exemplo
INSERT INTO client_contracts (user_id, plan_type, billing_period, monthly_value, contract_start, contract_end, is_active) VALUES
  ('user-joao-silva', 'mini-indice', 'monthly', 800.00, '2024-01-01', '2024-12-31', true),
  ('user-maria-santos', 'portfolio-completo', 'semiannual', 1200.00, '2024-02-01', '2024-08-01', true),
  ('user-carlos-oliveira', 'mini-dolar', 'annual', 600.00, '2024-03-01', '2025-03-01', true),
  ('user-ana-costa', 'bitcoin', 'monthly', 400.00, '2024-01-15', '2024-07-15', false),
  ('admin-pedro-pardal', 'portfolio-completo', 'annual', 0.00, '2024-01-01', '2025-12-31', true)
ON CONFLICT DO NOTHING;

-- Inserir custos de exemplo
INSERT INTO financial_costs (description, category, amount, cost_date, is_recurring) VALUES
  ('Servidor VPS', 'infraestrutura', 150.00, '2024-01-01', true),
  ('Licenças de Software', 'tecnologia', 300.00, '2024-01-01', true),
  ('Marketing Digital', 'marketing', 500.00, '2024-01-01', true),
  ('Suporte Técnico', 'pessoal', 2000.00, '2024-01-01', true),
  ('Hospedagem e Domínio', 'infraestrutura', 80.00, '2024-01-01', true),
  ('Ferramentas de Desenvolvimento', 'tecnologia', 200.00, '2024-01-01', true),
  ('Consultoria Jurídica', 'operacional', 800.00, '2024-01-15', false),
  ('Equipamentos', 'infraestrutura', 1200.00, '2024-02-01', false)
ON CONFLICT DO NOTHING;