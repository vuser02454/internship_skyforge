-- ============================================================
-- TaskForge: Real-time Chat Integration
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create the task_messages table
CREATE TABLE IF NOT EXISTS public.task_messages (
  id uuid default gen_random_uuid() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security
ALTER TABLE public.task_messages ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Only the client and the assigned freelancer can READ messages
CREATE POLICY "Users can read messages for their tasks" 
  ON public.task_messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE id = task_messages.task_id 
      AND (client_id = auth.uid() OR freelancer_id = auth.uid())
    )
  );

-- 4. Policy: Only the client and the assigned freelancer can SEND messages
CREATE POLICY "Users can insert messages to their tasks" 
  ON public.task_messages FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE id = task_messages.task_id 
      AND (client_id = auth.uid() OR freelancer_id = auth.uid())
    )
    AND sender_id = auth.uid()
  );

-- 5. Enable Realtime for the messages table
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.task_messages;
  EXCEPTION
    WHEN duplicate_object THEN
      NULL;
  END;
END $$;
