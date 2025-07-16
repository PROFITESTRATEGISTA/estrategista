/*
  # Create users table for admin panel

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `phone` (text, optional)
      - `name` (text)
      - `plan` (text, default 'free')
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `last_login` (timestamp, optional)

  2. Security
    - Enable RLS on `users` table
    - Add policy for authenticated users to read their own data
    - Add policy for admin users to manage all users
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone text,
  name text NOT NULL,
  plan text DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'master')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy for admin users to manage all users
CREATE POLICY "Admin users can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'pedropardal04@gmail.com'
    )
  );

-- Policy for admin users to insert new users
CREATE POLICY "Admin users can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'pedropardal04@gmail.com'
    )
  );