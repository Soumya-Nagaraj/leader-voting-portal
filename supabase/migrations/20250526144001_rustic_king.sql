/*
  # Add vote limit check function

  1. New Function
    - `check_vote_limit`: Checks if a user has already cast 5 votes
    - Returns boolean indicating if user can vote
  
  2. Update increment_votes
    - Add vote limit check before incrementing
*/

-- Function to check if user has reached vote limit
CREATE OR REPLACE FUNCTION check_vote_limit(user_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  vote_count integer;
BEGIN
  SELECT COUNT(*) INTO vote_count
  FROM votes
  WHERE votes.user_id = check_vote_limit.user_id;
  
  RETURN vote_count < 5;
END;
$$;

-- Update increment_votes to check limit
CREATE OR REPLACE FUNCTION increment_votes(nominee_id UUID, user_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT check_vote_limit(user_id) THEN
    RETURN false;
  END IF;

  UPDATE nominees
  SET votes = votes + 1
  WHERE id = nominee_id;
  
  RETURN true;
END;
$$;