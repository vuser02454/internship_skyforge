-- Migration to add task attachments support
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS attachment_url text;

-- Create task_attachments bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('task_attachments', 'task_attachments', true) 
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for task_attachments
CREATE POLICY "Task attachments are publicly accessible." 
ON storage.objects FOR SELECT 
USING (bucket_id = 'task_attachments');

CREATE POLICY "Authenticated users can upload task attachments." 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'task_attachments');

CREATE POLICY "Authenticated users can update their task attachments." 
ON storage.objects FOR UPDATE 
WITH CHECK (bucket_id = 'task_attachments');
