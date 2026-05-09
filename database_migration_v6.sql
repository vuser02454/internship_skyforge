-- ============================================================
-- TaskForge Database Migration v6: Payment System
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Freelancer Payout Details Table
CREATE TABLE IF NOT EXISTS public.payout_details (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  payout_type text NOT NULL DEFAULT 'upi',
  upi_id text,
  bank_account_number text,
  bank_ifsc text,
  bank_account_name text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id)
);

-- 2. Payments Log Table
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.profiles(id),
  freelancer_id uuid REFERENCES public.profiles(id),
  amount numeric NOT NULL,
  currency text DEFAULT 'INR',
  razorpay_order_id text,
  razorpay_payment_id text,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 3. Enable RLS
ALTER TABLE public.payout_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Users manage own payout details"
ON public.payout_details FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Task participants can view payments"
ON public.payments FOR SELECT
USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

CREATE POLICY "Clients can insert payments"
ON public.payments FOR INSERT
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Service role can update payments"
ON public.payments FOR UPDATE
USING (true);
