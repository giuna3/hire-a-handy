-- Add client_type column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN client_type text DEFAULT 'client' CHECK (client_type IN ('client', 'student', 'business'));