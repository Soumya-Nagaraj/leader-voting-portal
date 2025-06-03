/*
  # Add image URL to nominees table

  1. Changes
    - Add imageUrl column to nominees table for character images
*/

ALTER TABLE nominees ADD COLUMN imageUrl text;