-- Migration: Add is_favorite field to categories table
-- Description: Allow users to mark categories as favorites for quick access
-- Date: 2025-12-19

-- Add is_favorite column to categories table
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false NOT NULL;

-- Add index for faster queries on favorite categories
CREATE INDEX IF NOT EXISTS idx_categories_user_favorite
ON categories(user_id, is_favorite);

-- Comment on column
COMMENT ON COLUMN categories.is_favorite IS 'Indicates if the category is marked as favorite by the user';
