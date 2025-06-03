-- Create config table
CREATE TABLE IF NOT EXISTS public.config (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can read config" ON public.config;

-- Add RLS policies
CREATE POLICY "Anyone can read config"
  ON public.config
  FOR SELECT
  TO public
  USING (true);

-- Insert initial countdown configuration
INSERT INTO public.config (key, value)
VALUES (
  'countdown',
  '{"end_date": "2025-06-03T23:59:59Z"}'::jsonb
)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    updated_at = now();