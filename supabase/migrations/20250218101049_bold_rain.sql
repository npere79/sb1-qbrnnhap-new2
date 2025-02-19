/*
  # Fix Authentication and Database Schema

  1. Changes
    - Ensures auth schema exists
    - Creates auth.users table if it doesn't exist
    - Recreates books table with proper constraints
    - Sets up RLS policies
    - Creates test user account
*/

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create auth.users table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.users (
    id uuid NOT NULL PRIMARY KEY,
    instance_id uuid,
    email text,
    encrypted_password text,
    email_confirmed_at timestamptz,
    invited_at timestamptz,
    confirmation_token text,
    confirmation_sent_at timestamptz,
    recovery_token text,
    recovery_sent_at timestamptz,
    email_change_token_new text,
    email_change text,
    email_change_sent_at timestamptz,
    last_sign_in_at timestamptz,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamptz,
    updated_at timestamptz,
    phone text,
    phone_confirmed_at timestamptz,
    phone_change text,
    phone_change_token text,
    phone_change_sent_at timestamptz,
    confirmed_at timestamptz,
    email_change_token_current text,
    email_change_confirm_status smallint,
    banned_until timestamptz,
    reauthentication_token text,
    reauthentication_sent_at timestamptz,
    is_sso_user boolean DEFAULT false,
    deleted_at timestamptz,
    role text
);

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON auth.users (email) WHERE email IS NOT NULL;

-- Recreate books table with proper constraints
DROP TABLE IF EXISTS books;
CREATE TABLE books (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    author text NOT NULL,
    last_read timestamptz,
    chunks jsonb NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create indices for better performance
CREATE INDEX IF NOT EXISTS books_user_id_idx ON books(user_id);
CREATE INDEX IF NOT EXISTS books_last_read_idx ON books(last_read);

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own books"
    ON books FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own books"
    ON books FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own books"
    ON books FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create test user if it doesn't exist
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
            confirmed_at
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
            now()
        );
    END IF;
END $$;