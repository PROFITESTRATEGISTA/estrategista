/*
  # Corrigir permissões de admin para tabela users

  1. Políticas de Segurança
    - Política para admin ler todos os usuários
    - Política para admin gerenciar todos os usuários
    - Política para usuários lerem apenas seus próprios dados

  2. Correções
    - Garantir que admin pode acessar tabela users
    - Permitir operações CRUD para administradores
*/

-- Remover políticas existentes que podem estar conflitando
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admin users can manage all users" ON users;
DROP POLICY IF EXISTS "Admin users can insert users" ON users;

-- Política para usuários lerem apenas seus próprios dados
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Política para admin ler todos os usuários
CREATE POLICY "Admin can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    auth.email() = 'pedropardal04@gmail.com'
  );

-- Política para admin inserir usuários
CREATE POLICY "Admin can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.email() = 'pedropardal04@gmail.com'
  );

-- Política para admin atualizar usuários
CREATE POLICY "Admin can update users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    auth.email() = 'pedropardal04@gmail.com'
  )
  WITH CHECK (
    auth.email() = 'pedropardal04@gmail.com'
  );

-- Política para admin deletar usuários
CREATE POLICY "Admin can delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (
    auth.email() = 'pedropardal04@gmail.com'
  );