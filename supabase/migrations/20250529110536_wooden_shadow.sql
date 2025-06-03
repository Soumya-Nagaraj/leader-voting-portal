-- First, disable RLS temporarily to allow deletion
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE nominees DISABLE ROW LEVEL SECURITY;

-- Clear all votes first (due to foreign key constraints)
TRUNCATE TABLE votes;

-- Reset the votes count on nominees
UPDATE nominees SET votes = 0;

-- Delete all users from auth.users (this will cascade to their related data)
DELETE FROM auth.users;

-- Re-enable RLS
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE nominees ENABLE ROW LEVEL SECURITY;