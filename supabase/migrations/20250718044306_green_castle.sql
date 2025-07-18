/*
  # Criar tabela de contratos

  1. Nova Tabela
    - `contracts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key para users)
      - `start_date` (date)
      - `end_date` (date)
      - `plan` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Enable RLS na tabela `contracts`
    - Políticas para admin e usuários próprios

  3. Índices
    - Índice para user_id
    - Índice para end_date (para consultas de expiração)
*/

-- Criar tabela de contratos
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date date,
  end_date date,
  plan text DEFAULT 'free',
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Admin can manage all contracts"
  ON contracts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.email = 'pedropardal04@gmail.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.email = 'pedropardal04@gmail.com'
    )
  );

CREATE POLICY "Users can view own contracts"
  ON contracts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Service role can manage contracts"
  ON contracts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_end_date ON contracts(end_date);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_contracts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER contracts_updated_at_trigger
  BEFORE UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_contracts_updated_at();

-- Inserir contratos de exemplo
INSERT INTO contracts (user_id, start_date, end_date, plan, status) VALUES
  -- Pedro Pardal (admin) - contrato master longo
  ((SELECT id FROM users WHERE email = 'pedropardal04@gmail.com' LIMIT 1), '2024-01-01', '2025-12-31', 'master', 'active'),
  -- Outros usuários com contratos variados
  ((SELECT id FROM users WHERE email != 'pedropardal04@gmail.com' LIMIT 1 OFFSET 0), '2024-06-01', '2024-12-31', 'pro', 'active'),
  ((SELECT id FROM users WHERE email != 'pedropardal04@gmail.com' LIMIT 1 OFFSET 1), '2024-07-01', '2024-08-31', 'free', 'expired')
ON CONFLICT DO NOTHING;