/*
  # Add admin user

  1. Changes
    - Creates a new admin user with email "admin" and password "admin"
    - Inserts the user directly into the auth.users table
    - Sets up necessary user metadata and authentication settings
*/

-- Create the admin user if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin'
  ) THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role,
      aud,
      confirmation_token
    )
    VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'admin',
      crypt('admin', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Admin User"}',
      false,
      'authenticated',
      'authenticated',
      encode(gen_random_bytes(32), 'base64')
    );
  END IF;
END $$;