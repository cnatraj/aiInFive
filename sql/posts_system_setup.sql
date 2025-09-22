-- Add run_id column to existing posts table
-- Run this in your Supabase SQL Editor

-- Add run_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='posts' AND column_name='run_id') THEN
        ALTER TABLE posts ADD COLUMN run_id VARCHAR(100);
    END IF;
END $$;

-- Create index for run_id for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_run_id ON posts(run_id);