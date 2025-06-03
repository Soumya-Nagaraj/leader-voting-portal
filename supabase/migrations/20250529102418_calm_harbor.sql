-- Create a function to get voters with their email addresses
CREATE OR REPLACE FUNCTION get_voters_with_email(nominee_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  created_at TIMESTAMPTZ,
  user_email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.user_id,
    v.created_at,
    u.email as user_email
  FROM votes v
  JOIN auth.users u ON v.user_id = u.id
  WHERE v.nominee_id = $1
  ORDER BY v.created_at DESC;
END;
$$;