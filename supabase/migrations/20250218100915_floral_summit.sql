/*
  # Fix schema issues

  1. Changes
    - Ensures auth schema exists
    - Adds missing indices
    - Adds missing constraints
*/

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Ensure books table has proper indices
CREATE INDEX IF NOT EXISTS books_user_id_idx ON books(user_id);
CREATE INDEX IF NOT EXISTS books_last_read_idx ON books(last_read);

-- Add missing constraints
ALTER TABLE books DROP CONSTRAINT IF EXISTS books_user_id_fkey;
ALTER TABLE books 
  ADD CONSTRAINT books_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id)
  ON DELETE CASCADE;