/*
  # Update test user password

  1. Changes
    - Updates the password for admin@bookswipe.net user to "password"
    - Ensures the user exists before attempting update
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@bookswipe.net'
  ) THEN
    UPDATE auth.users
    SET encrypted_password = crypt('password', gen_salt('bf'))
    WHERE email = 'admin@bookswipe.net';
  ELSE
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
      crypt('password', gen_salt('bf')),
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