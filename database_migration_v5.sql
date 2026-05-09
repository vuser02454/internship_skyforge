-- ============================================================
-- TaskForge: Add Submission Link Support
-- Run this in Supabase SQL Editor
-- ============================================================

ALTER TABLE public.tasks 
  ADD COLUMN IF NOT EXISTS submission_link text;
