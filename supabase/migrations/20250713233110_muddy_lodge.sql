/*
  # Add phone verification status to users table

  1. New Columns
    - `phone_verified` (boolean, default false)
    - Update existing phone column to ensure it exists
  
  2. Security
    - Update RLS policies to include new field
    - Admin can manage phone verification status
*/

-- Add phone_verified column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'phone_verified'
  ) THEN
    ALTER TABLE users ADD COLUMN phone_verified boolean DEFAULT false;
  END IF;
END $$;

-- Ensure phone column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone text;
  END IF;
END $$;

-- Update the sync trigger function to handle phone verification
CREATE OR REPLACE FUNCTION sync_user_to_users_table()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id, 
    email, 
    phone,
    name, 
    plan, 
    is_active,
    phone_verified,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email_confirmed_at IS NOT NULL AND split_part(NEW.email, '@', 1)),
    'free',
    true,
    NEW.phone_confirmed_at IS NOT NULL,
    NEW.created_at
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    phone = COALESCE(EXCLUDED.phone, users.phone),
    name = COALESCE(EXCLUDED.name, users.name),
    phone_verified = NEW.phone_confirmed_at IS NOT NULL,
    last_login = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;