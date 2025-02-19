/*
  # Create books table

  1. New Tables
    - `books`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `author` (text)
      - `last_read` (timestamptz)
      - `chunks` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `books` table
    - Add policies for authenticated users to:
      - Read their own books
      - Create new books
      - Update their own books
*/

CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  author text NOT NULL,
  last_read timestamptz,
  chunks jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own books
CREATE POLICY "Users can read own books"
  ON books
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to create books
CREATE POLICY "Users can create books"
  ON books
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own books
CREATE POLICY "Users can update own books"
  ON books
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);