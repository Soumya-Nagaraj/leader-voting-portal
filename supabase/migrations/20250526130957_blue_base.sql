/*
  # Create nominees and votes tables

  1. New Tables
    - `nominees`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `votes` (integer)
      - `created_at` (timestamp)
      - `approved` (boolean)
    - `votes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `nominee_id` (uuid, references nominees)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - Read nominees
      - Create votes (one per user)
*/

-- Create nominees table
CREATE TABLE IF NOT EXISTS nominees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  approved boolean DEFAULT true
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  nominee_id uuid REFERENCES nominees NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, nominee_id)
);

-- Enable RLS
ALTER TABLE nominees ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policies for nominees
CREATE POLICY "Anyone can read nominees"
  ON nominees
  FOR SELECT
  TO public
  USING (true);

-- Policies for votes
CREATE POLICY "Authenticated users can create votes"
  ON votes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    NOT EXISTS (
      SELECT 1 FROM votes
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read their own votes"
  ON votes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);