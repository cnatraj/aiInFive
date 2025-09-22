-- Add week_number and year columns to posts table
-- Run this in your Supabase SQL Editor
-- This adds generated columns for week number (1-53) and year

-- First create immutable functions for week and year calculation
CREATE OR REPLACE FUNCTION get_week_number(input_date TIMESTAMPTZ)
RETURNS INTEGER
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT EXTRACT(WEEK FROM input_date)::INTEGER;
$$;

CREATE OR REPLACE FUNCTION get_year(input_date TIMESTAMPTZ)
RETURNS INTEGER
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT EXTRACT(YEAR FROM input_date)::INTEGER;
$$;

-- Drop existing week_of column if it exists (since we're changing the structure)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name='posts' AND column_name='week_of') THEN
        ALTER TABLE posts DROP COLUMN week_of;
    END IF;
END $$;

-- Add week_number generated column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='posts' AND column_name='week_number') THEN
        ALTER TABLE posts
        ADD COLUMN week_number INTEGER GENERATED ALWAYS AS (
            get_week_number(created_at)
        ) STORED;
    END IF;
END $$;

-- Add year generated column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='posts' AND column_name='year') THEN
        ALTER TABLE posts
        ADD COLUMN year INTEGER GENERATED ALWAYS AS (
            get_year(created_at)
        ) STORED;
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_week_number ON posts(week_number);
CREATE INDEX IF NOT EXISTS idx_posts_year ON posts(year);
CREATE INDEX IF NOT EXISTS idx_posts_year_week ON posts(year, week_number);

-- ============================================================================
-- HELPFUL QUERIES FOR WEEKLY OPERATIONS
-- ============================================================================

-- View posts grouped by year and week
-- SELECT year, week_number, COUNT(*) as post_count
-- FROM posts
-- GROUP BY year, week_number
-- ORDER BY year DESC, week_number DESC;

-- Get all posts for a specific week
-- SELECT id, headline, status, created_at, year, week_number
-- FROM posts
-- WHERE year = 2025 AND week_number = 38  -- Replace with desired year and week
-- ORDER BY created_at DESC;

-- Weekly summary with status breakdown
-- SELECT
--     year,
--     week_number,
--     COUNT(*) as total_posts,
--     COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
--     COUNT(CASE WHEN status = 'selected' THEN 1 END) as selected,
--     COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
--     COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived
-- FROM posts
-- GROUP BY year, week_number
-- ORDER BY year DESC, week_number DESC;

-- Archive all posts older than 4 weeks (example maintenance query)
-- UPDATE posts
-- SET status = 'archived', archived_at = NOW()
-- WHERE (year < EXTRACT(YEAR FROM NOW())
--        OR (year = EXTRACT(YEAR FROM NOW()) AND week_number < EXTRACT(WEEK FROM NOW()) - 4))
-- AND status = 'pending';

-- Find the current week's posts
-- SELECT id, headline, status, created_at, year, week_number
-- FROM posts
-- WHERE year = EXTRACT(YEAR FROM NOW()) AND week_number = EXTRACT(WEEK FROM NOW())
-- ORDER BY created_at DESC;

-- Get posts for the last 3 weeks
-- SELECT id, headline, status, year, week_number, created_at
-- FROM posts
-- WHERE (year = EXTRACT(YEAR FROM NOW()) AND week_number >= EXTRACT(WEEK FROM NOW()) - 2)
-- ORDER BY year DESC, week_number DESC, created_at DESC;