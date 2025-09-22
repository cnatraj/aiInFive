-- Weekly Publishing Workflow - Database Schema Updates
-- Run this in your Supabase SQL Editor
-- This adds fields to support: Import -> Review -> Select 5 -> Publish -> Archive workflow

-- Add run_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='posts' AND column_name='run_id') THEN
        ALTER TABLE posts ADD COLUMN run_id VARCHAR(100);
    END IF;
END $$;

-- Add status column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='posts' AND column_name='status') THEN
        ALTER TABLE posts ADD COLUMN status VARCHAR(20) DEFAULT 'pending';
    END IF;
END $$;

-- Add published_at column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='posts' AND column_name='published_at') THEN
        ALTER TABLE posts ADD COLUMN published_at TIMESTAMPTZ;
    END IF;
END $$;

-- Add archived_at column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='posts' AND column_name='archived_at') THEN
        ALTER TABLE posts ADD COLUMN archived_at TIMESTAMPTZ;
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_run_id ON posts(run_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_posts_archived_at ON posts(archived_at);

-- Add check constraint for valid status values
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_status_check;
ALTER TABLE posts ADD CONSTRAINT posts_status_check
    CHECK (status IN ('pending', 'selected', 'published', 'archived'));

-- ============================================================================
-- HELPFUL QUERIES FOR WEEKLY WORKFLOW
-- ============================================================================

-- View all pending posts (ready for selection)
-- SELECT id, headline, summary, source_id, created_at
-- FROM posts
-- WHERE status = 'pending'
-- ORDER BY created_at DESC;

-- Select 5 posts for publishing (replace with actual post IDs)
-- UPDATE posts
-- SET status = 'selected'
-- WHERE id IN ('post-id-1', 'post-id-2', 'post-id-3', 'post-id-4', 'post-id-5');

-- Publish all selected posts
-- UPDATE posts
-- SET status = 'published', published_at = NOW()
-- WHERE status = 'selected';

-- Archive all remaining pending posts older than 7 days
-- UPDATE posts
-- SET status = 'archived', archived_at = NOW()
-- WHERE status = 'pending' AND created_at < NOW() - INTERVAL '7 days';

-- Count posts by status
-- SELECT status, COUNT(*) as count
-- FROM posts
-- GROUP BY status;

-- Weekly archive summary
-- SELECT run_id,
--        COUNT(*) as total_imported,
--        COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
--        COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived
-- FROM posts
-- WHERE run_id IS NOT NULL
-- GROUP BY run_id
-- ORDER BY MAX(created_at) DESC;