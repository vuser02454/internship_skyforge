-- Add bio and skills to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN bio text,
ADD COLUMN skills text[] DEFAULT '{}';
