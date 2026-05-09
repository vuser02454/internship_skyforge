-- ============================================================
-- TaskForge: Add Deadline Feature
-- Run this in Supabase SQL Editor
-- ============================================================

ALTER TABLE public.tasks 
  ADD COLUMN IF NOT EXISTS deadline date;
