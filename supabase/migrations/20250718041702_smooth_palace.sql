/*
  # Adicionar colunas de contrato aos usuários

  1. Novas Colunas
    - `contract_start` (date) - Data de início do contrato
    - `contract_end` (date) - Data de fim do contrato
  
  2. Funcionalidades
    - Permite controle de período contratual
    - Suporte a cálculo de dias restantes
    - Campos opcionais (nullable)
*/

-- Adicionar colunas de contrato à tabela users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS contract_start date,
ADD COLUMN IF NOT EXISTS contract_end date;

-- Adicionar comentários para documentação
COMMENT ON COLUMN users.contract_start IS 'Data de início do contrato do usuário';
COMMENT ON COLUMN users.contract_end IS 'Data de fim do contrato do usuário';

-- Criar índice para consultas por data de fim de contrato
CREATE INDEX IF NOT EXISTS idx_users_contract_end ON users(contract_end);

-- Atualizar dados de exemplo para Pedro Pardal (admin)
UPDATE users 
SET 
  contract_start = '2024-01-01',
  contract_end = '2025-12-31'
WHERE email = 'pedropardal04@gmail.com';