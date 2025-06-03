/*
  # Fix votes table RLS policy

  1. Changes
    - Drop existing INSERT policy
    - Create new INSERT policy with proper row reference
    - Maintain the same security rules:
      - Users can only vote for themselves
      - No duplicate votes for same nominee
      - Maximum 5 votes per user

  2. Security
    - Policy applies only to authenticated users
    - Ensures data integrity with proper checks
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create votes" ON votes;

-- Create new simplified INSERT policy
CREATE POLICY "Authenticated users can create votes"
ON votes
FOR INSERT
TO authenticated
WITH CHECK (
  -- User can only create votes for themselves
  auth.uid() = user_id 
  -- User hasn't already voted for this nominee
  AND NOT EXISTS (
    SELECT 1 FROM votes
    WHERE user_id = auth.uid()
    AND nominee_id = votes.nominee_id
  )
  -- User hasn't exceeded 5 total votes
  AND (
    SELECT COUNT(*) FROM votes 
    WHERE user_id = auth.uid()
  ) < 5
);