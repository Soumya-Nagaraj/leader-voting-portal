-- Drop the existing function first
DROP FUNCTION IF EXISTS get_voters_with_email(uuid);

-- Create the function with name included in the return type and alphabetical sorting
CREATE OR REPLACE FUNCTION get_voters_with_email(nominee_uuid uuid)
RETURNS TABLE (
    user_id uuid,
    nominee_id uuid,
    created_at timestamptz,
    user_email text,
    user_name text
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
        (SELECT email::text FROM auth.users WHERE id = v.user_id) as user_email,
        (SELECT COALESCE((raw_user_meta_data->>'full_name')::text, 'Anonymous User') 
         FROM auth.users 
         WHERE id = v.user_id) as user_name
    FROM votes v
    WHERE v.nominee_id = nominee_uuid
    ORDER BY (
        SELECT COALESCE((raw_user_meta_data->>'full_name')::text, 'Anonymous User') 
        FROM auth.users 
        WHERE id = v.user_id
    ) ASC;
END;
$$;