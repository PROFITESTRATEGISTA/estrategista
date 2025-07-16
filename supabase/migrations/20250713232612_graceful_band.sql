/*
  # Fix user registration database error

  1. Database Schema
    - Ensure users table has all required columns
    - Add phone column if missing
    - Update constraints and defaults

  2. Trigger Function
    - Create function to sync auth.users to public.users
    - Handle phone and name from user_metadata
    - Ensure proper error handling

  3. Security
    - Update RLS policies for user registration
    - Allow authenticated users to insert their own data
*/

-- Ensure users table has all required columns
DO $$
BEGIN
  -- Add phone column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone text;
  END IF;

  -- Ensure name column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'name'
  ) THEN
    ALTER TABLE users ADD COLUMN name text NOT NULL DEFAULT '';
  END IF;

  -- Ensure other required columns exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'plan'
  ) THEN
    ALTER TABLE users ADD COLUMN plan text DEFAULT 'free';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE users ADD COLUMN is_active boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE users ADD COLUMN last_login timestamptz;
  END IF;
END $$;

-- Create or replace the trigger function to sync users
CREATE OR REPLACE FUNCTION sync_user_to_users_table()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT (new user registration)
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.users (
      id,
      email,
      phone,
      name,
      plan,
      is_active,
      created_at
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone),
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
      'free',
      true,
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      phone = COALESCE(EXCLUDED.phone, users.phone),
      name = COALESCE(EXCLUDED.name, users.name),
      last_login = NOW();
    
    RETURN NEW;
  END IF;

  -- Handle UPDATE (user data changes)
  IF TG_OP = 'UPDATE' THEN
    UPDATE public.users SET
      email = NEW.email,
      phone = COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone, users.phone),
      name = COALESCE(NEW.raw_user_meta_data->>'name', users.name),
      last_login = CASE 
        WHEN NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at 
        THEN NEW.last_sign_in_at 
        ELSE users.last_login 
      END
    WHERE id = NEW.id;
    
    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS sync_user_trigger ON auth.users;

-- Create the trigger
CREATE TRIGGER sync_user_trigger
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_to_users_table();

-- Update RLS policies to allow user registration
DROP POLICY IF EXISTS "Users can insert own data" ON users;
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow service role to insert/update for triggers
DROP POLICY IF EXISTS "Service role can manage users" ON users;
CREATE POLICY "Service role can manage users"
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Ensure plan constraint is correct
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'users' AND constraint_name = 'users_plan_check'
  ) THEN
    ALTER TABLE users DROP CONSTRAINT users_plan_check;
  END IF;
  
  ALTER TABLE users ADD CONSTRAINT users_plan_check 
    CHECK (plan = ANY (ARRAY['free'::text, 'pro'::text, 'master'::text]));
END $$;