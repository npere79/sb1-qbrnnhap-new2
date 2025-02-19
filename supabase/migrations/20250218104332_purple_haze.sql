/*
  # Fix auth schema and policies

  1. Schema Setup
    - Create auth schema and extensions
    - Drop and recreate auth.users table
  
  2. Tables
    - Drop and recreate books table with proper constraints
  
  3. Security
    - Enable RLS on books table
    - Drop and recreate policies for authenticated users
*/

-- Install required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create auth schema
CREATE SCHEMA IF NOT EXISTS auth;

-- Drop existing tables to ensure clean state
DROP TABLE IF EXISTS public.books CASCADE;
DROP TABLE IF EXISTS auth.users CASCADE;

-- Create auth.users table
CREATE TABLE auth.users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    instance_id uuid,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change_token_current character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    phone character varying(255),
    phone_confirmed_at timestamp with time zone,
    phone_change character varying(255), 
    phone_change_token character varying(255),
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone,
    email_change_confirm_status smallint,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255),
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false,
    deleted_at timestamp with time zone,
    CONSTRAINT users_email_key UNIQUE (email)
);

-- Create required indices
CREATE INDEX IF NOT EXISTS users_instance_id_idx ON auth.users(instance_id);
CREATE INDEX IF NOT EXISTS users_email_partial_key ON auth.users(email) WHERE (email IS NOT NULL AND deleted_at IS NULL);

-- Create books table
CREATE TABLE public.books (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    author text NOT NULL,
    last_read timestamptz,
    chunks jsonb NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create indices for better performance
CREATE INDEX IF NOT EXISTS books_user_id_idx ON public.books(user_id);
CREATE INDEX IF NOT EXISTS books_last_read_idx ON public.books(last_read);

-- Enable RLS
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can read own books" ON public.books;
DROP POLICY IF EXISTS "Users can insert own books" ON public.books;
DROP POLICY IF EXISTS "Users can update own books" ON public.books;

-- Create fresh policies
CREATE POLICY "Users can read own books"
    ON public.books FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own books"
    ON public.books FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own books"
    ON public.books FOR UPDATE
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
            confirmed_at
        )
        VALUES (
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
            now()
        );
    END IF;
END $$;