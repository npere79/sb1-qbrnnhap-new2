/*
  # Add test user account

  1. Changes
    - Creates a test user account with email admin@bookswipe.net
    - Sets up proper authentication credentials
    - Ensures email is properly formatted
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@bookswipe.net'
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
      'admin@bookswipe.net',
      crypt('admin', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Test User"}',
      false,
      'authenticated',
      'authenticated',
      encode(gen_random_bytes(32), 'base64')
    );
  END IF;
END $$;