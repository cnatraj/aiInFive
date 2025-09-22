-- Add image_url column to existing posts table
-- Run this in your Supabase SQL Editor

-- Add image_url column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='posts' AND column_name='image_url') THEN
        ALTER TABLE posts ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- Add a comment to document the column
COMMENT ON COLUMN posts.image_url IS 'URL to an image associated with the post';

-- Create index for image_url for better query performance when filtering posts with images
CREATE INDEX IF NOT EXISTS idx_posts_image_url_not_null ON posts(image_url) WHERE image_url IS NOT NULL;