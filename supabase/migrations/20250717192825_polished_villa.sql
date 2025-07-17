/*
  # Create solution requests table

  1. New Tables
    - `solution_requests`
      - `id` (uuid, primary key)
      - `name` (text, nome do solicitante)
      - `email` (text, email do solicitante)
      - `phone` (text, telefone do solicitante)
      - `project_type` (text, tipo de projeto)
      - `platform` (text[], plataformas selecionadas)
      - `modules` (jsonb, módulos selecionados)
      - `description` (text, descrição do projeto)
      - `status` (text, status da solicitação)
      - `priority` (text, prioridade)
      - `assigned_to` (uuid, usuário responsável)
      - `estimated_value` (numeric, valor estimado)
      - `notes` (text, observações internas)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `solution_requests` table
    - Add policy for admin users to manage requests
    - Add policy for users to view their own requests
*/

CREATE TABLE IF NOT EXISTS solution_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  project_type text NOT NULL,
  platform text[] DEFAULT '{}',
  modules jsonb DEFAULT '{}',
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to uuid REFERENCES users(id),
  estimated_value numeric(10,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE solution_requests ENABLE ROW LEVEL SECURITY;

-- Admin can manage all requests
CREATE POLICY "Admin can manage solution requests"
  ON solution_requests
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

-- Users can view their own requests
CREATE POLICY "Users can view own solution requests"
  ON solution_requests
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM users WHERE id = auth.uid()));

-- Service role can manage all requests
CREATE POLICY "Service role can manage solution requests"
  ON solution_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_solution_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER solution_requests_updated_at_trigger
  BEFORE UPDATE ON solution_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_solution_requests_updated_at();