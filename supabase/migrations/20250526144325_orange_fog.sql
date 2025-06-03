/*
  # Fix votes table RLS policy

  1. Changes
    - Drop existing INSERT policy
    - Create new INSERT policy with fixed syntax for vote validation
    - Maintains same security rules:
      - Users can only vote as themselves
      - No duplicate votes for same nominee
      - Maximum 5 votes per user

  2. Security
    - Policy ensures users can only create votes for themselves
    - Prevents duplicate votes
    - Limits total votes per user to 5
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Authenticated users can create votes" ON votes;

-- Create new simplified policy using proper syntax
CREATE POLICY "Users can create votes for themselves"
ON votes
FOR INSERT 
TO authenticated
WITH CHECK (
  -- User can only vote as themselves
  auth.uid() = user_id 
  -- No duplicate votes for same nominee
  AND NOT EXISTS (
    SELECT 1 FROM votes v
    WHERE v.user_id = auth.uid() 
    AND v.nominee_id = nominee_id
  )
  -- Maximum 5 votes per user
  AND (
    SELECT COUNT(*) FROM votes v
    WHERE v.user_id = auth.uid()
  ) < 5
);