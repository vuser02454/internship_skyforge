-- Migration: Add marketing_push to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS marketing_push BOOLEAN DEFAULT false;
