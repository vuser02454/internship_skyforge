-- Migration to add read receipts to task_messages
ALTER TABLE public.task_messages ADD COLUMN IF NOT EXISTS is_read boolean DEFAULT false NOT NULL;

-- Policy to allow users to update the is_read status of messages they received
CREATE POLICY "Users can mark received messages as read" 
  ON public.task_messages FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE id = task_messages.task_id 
      AND (client_id = auth.uid() OR freelancer_id = auth.uid())
    )
    AND sender_id != auth.uid()
  );
