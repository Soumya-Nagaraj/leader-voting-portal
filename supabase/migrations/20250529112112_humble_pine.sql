-- Create a new table for application configuration
CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- Allow public read access to config
CREATE POLICY "Anyone can read config" ON config
    FOR SELECT TO public USING (true);

-- Insert the countdown date configuration
INSERT INTO config (key, value) VALUES (
    'countdown',
    '{"end_date": "2025-06-03T23:59:59Z"}'
);