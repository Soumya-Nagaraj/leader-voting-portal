/*
  # Update nominees table structure
  
  1. Changes
    - Remove email column
    - Add department column (text)
    - Add location column (text)
    - Rename name to displayName
    
  2. Security
    - Maintain existing RLS policies
*/

DO $$ BEGIN
  -- Rename name column to displayName
  ALTER TABLE nominees RENAME COLUMN name TO displayName;
  
  -- Add new columns
  ALTER TABLE nominees ADD COLUMN department text;
  ALTER TABLE nominees ADD COLUMN location text;
  
  -- Remove email column
  ALTER TABLE nominees DROP COLUMN email;
END $$;