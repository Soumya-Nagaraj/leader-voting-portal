/*
  # Update votes table RLS policies

  1. Changes
    - Remove existing INSERT policy
    - Create new INSERT policy that allows:
      - Users to vote for up to 5 different nominees
      - Only one vote per nominee per user
      - Users can only create votes for themselves

  2. Security
    - Enable RLS
    - Maintain existing SELECT policy
    - Update INSERT policy with proper row-level checks
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create votes" ON votes;

-- Create new INSERT policy that allows multiple votes (one per nominee)
CREATE POLICY "Authenticated users can create votes"
ON votes
FOR INSERT
TO authenticated
WITH CHECK (
  -- User can only create votes for themselves
  auth.uid() = user_id AND
  -- Check if user hasn't already voted for this specific nominee
  NOT EXISTS (
    SELECT 1 FROM votes
    WHERE votes.user_id = auth.uid()
    AND votes.nominee_id = nominee_id
  ) AND
  -- Limit to 5 votes per user
  (
    SELECT COUNT(*)
    FROM votes
    WHERE votes.user_id = auth.uid()
  ) < 5
);