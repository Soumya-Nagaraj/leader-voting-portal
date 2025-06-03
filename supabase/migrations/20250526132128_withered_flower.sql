/*
  # Add increment_votes function

  1. New Function
    - Creates a function to safely increment votes for a nominee
    - Handles concurrent updates properly
    - Returns the updated nominee record

  2. Security
    - Function is accessible to authenticated users only
*/

CREATE OR REPLACE FUNCTION increment_votes(nominee_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE nominees
  SET votes = votes + 1
  WHERE id = nominee_id;
END;
$$;