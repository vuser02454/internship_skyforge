-- ============================================================
-- TaskForge: Real-Time Task Acceptance System
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. ADD NEW COLUMNS to tasks table for freelancer assignment
-- ============================================================
ALTER TABLE public.tasks 
  ADD COLUMN IF NOT EXISTS freelancer_id uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS accepted_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS completed_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- 2. ADD INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_freelancer ON public.tasks(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_tasks_client ON public.tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created ON public.tasks(created_at DESC);

-- 3. DROP old restrictive RLS policies and create better ones
-- ============================================================
-- Drop existing update policy (only allowed client updates)
DROP POLICY IF EXISTS "Clients can update their own tasks." ON public.tasks;

-- Clients can update their OWN tasks (title, description, cancel, etc.)
CREATE POLICY "Clients can update own tasks"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = client_id);

-- Freelancers can update tasks ONLY to accept them (set freelancer_id to themselves)
-- This policy allows a freelancer to update a task where:
--   1. The task is currently 'open' (no one has taken it yet)
--   2. The freelancer_id is currently NULL
-- The actual atomic lock happens in the accept_task function below.
CREATE POLICY "Freelancers can accept open tasks"
  ON public.tasks FOR UPDATE
  USING (
    status = 'open' 
    AND freelancer_id IS NULL 
    AND auth.uid() != client_id  -- Can't accept your own task
  );

-- 4. ATOMIC TASK ACCEPTANCE FUNCTION (prevents race conditions)
-- ============================================================
-- This is the KEY function. It uses a WHERE clause that acts as a lock:
-- Only ONE freelancer can ever succeed because the UPDATE checks
-- status='open' AND freelancer_id IS NULL atomically.
-- If two freelancers click "Accept" at the exact same millisecond,
-- only the first UPDATE will match the WHERE clause. The second
-- will find status='in_progress' and freelancer_id is no longer NULL,
-- so it updates 0 rows and returns false.

CREATE OR REPLACE FUNCTION public.accept_task(task_id uuid, freelancer uuid)
RETURNS boolean AS $$
DECLARE
  rows_updated integer;
BEGIN
  UPDATE public.tasks
  SET 
    freelancer_id = freelancer,
    status = 'in_progress',
    accepted_at = now(),
    updated_at = now()
  WHERE 
    id = task_id 
    AND status = 'open' 
    AND freelancer_id IS NULL
    AND client_id != freelancer;  -- Can't accept your own task
  
  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  
  RETURN rows_updated > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. ENABLE REALTIME on the tasks table
-- ============================================================
-- This allows Supabase Realtime to broadcast INSERT/UPDATE/DELETE
-- events to all connected clients instantly.
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;

-- 6. AUTO-UPDATE updated_at TIMESTAMP
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tasks_updated_at ON public.tasks;
CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
