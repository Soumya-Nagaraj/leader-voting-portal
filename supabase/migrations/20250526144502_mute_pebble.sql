/*
  # Fix votes table RLS policy

  1. Changes
    - Drop existing INSERT policy
    - Create new INSERT policy with fixed conditions that:
      - Ensures users can only vote as themselves
      - Prevents duplicate votes
      - Limits to 5 votes per user
    
  2. Security
    - Maintains RLS protection
    - Enforces user-specific vote limits
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Users can create votes for themselves" ON votes;

-- Create new INSERT policy using proper syntax
CREATE POLICY "Users can create votes for themselves"
ON votes
FOR INSERT
TO authenticated
WITH CHECK (
  -- User can only vote as themselves
  auth.uid() = user_id 
  -- No duplicate votes for same nominee
  AND NOT EXISTS (
    SELECT 1 
    FROM votes v
    WHERE v.user_id = auth.uid() 
    AND v.nominee_id = nominee_id
  )
  -- Maximum 5 votes per user
  AND (
    SELECT COUNT(*) 
    FROM votes v
    WHERE v.user_id = auth.uid()
  ) < 5
);