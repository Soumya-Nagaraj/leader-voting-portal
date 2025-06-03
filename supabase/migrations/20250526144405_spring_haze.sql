/*
  # Fix votes table RLS policy

  1. Changes
    - Drop existing INSERT policy that has incorrect syntax
    - Create new INSERT policy with correct syntax for vote validation
  
  2. Security
    - Policy ensures users can only:
      - Vote for themselves (user_id matches authenticated user)
      - Vote maximum 5 times
      - Not vote for the same nominee twice
*/

-- Drop the existing policy with incorrect syntax
DROP POLICY IF EXISTS "Users can create votes for themselves" ON votes;

-- Create new policy with correct syntax
CREATE POLICY "Users can create votes for themselves"
ON votes
FOR INSERT
TO authenticated
WITH CHECK (
  -- User can only create votes for themselves
  auth.uid() = user_id 
  -- User cannot vote for the same nominee twice
  AND NOT EXISTS (
    SELECT 1 
    FROM votes v 
    WHERE v.user_id = auth.uid() 
    AND v.nominee_id = nominee_id
  )
  -- User cannot vote more than 5 times
  AND (
    SELECT COUNT(*) 
    FROM votes v 
    WHERE v.user_id = auth.uid()
  ) < 5
);