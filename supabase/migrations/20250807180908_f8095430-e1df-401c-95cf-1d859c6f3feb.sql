-- Add provider_type column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN provider_type text DEFAULT 'normal' CHECK (provider_type IN ('normal', 'student'));