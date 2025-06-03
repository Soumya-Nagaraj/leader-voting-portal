/*
  # Fix votes table RLS policy

  1. Changes
    - Drop existing INSERT policy
    - Create new INSERT policy with corrected condition
    
  2. Security
    - Policy ensures users can only:
      - Vote for themselves
      - Vote once per nominee
      - Have maximum 5 votes total
*/

DROP POLICY IF EXISTS "Users can create votes for themselves" ON votes;

CREATE POLICY "Users can create votes for themselves"
ON votes
FOR INSERT
TO authenticated
WITH CHECK (
  -- User can only vote as themselves
  auth.uid() = user_id 
  -- User hasn't voted for this nominee yet (using proper column reference)
  AND NOT EXISTS (
    SELECT 1 FROM votes v 
    WHERE v.user_id = auth.uid() 
    AND v.nominee_id = votes.nominee_id
  )
  -- User has less than 5 votes total
  AND (
    SELECT count(*) 
    FROM votes v 
    WHERE v.user_id = auth.uid()
  ) < 5
);