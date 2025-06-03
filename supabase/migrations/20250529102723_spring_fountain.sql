-- Drop the existing function first
DROP FUNCTION IF EXISTS get_voters_with_email(uuid);

-- Create the function with the correct return type
CREATE OR REPLACE FUNCTION get_voters_with_email(nominee_uuid uuid)
RETURNS TABLE (
    user_id uuid,
    nominee_id uuid,
    created_at timestamptz,
    user_email text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.user_id,
        v.nominee_id,
        v.created_at,
        (SELECT email::text FROM auth.users WHERE id = v.user_id) as user_email
    FROM votes v
    WHERE v.nominee_id = nominee_uuid;
END;
$$;