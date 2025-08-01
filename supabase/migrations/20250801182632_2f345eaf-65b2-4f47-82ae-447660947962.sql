-- Allow provider_id to be null for job postings that haven't been assigned to a provider yet
ALTER TABLE public.bookings ALTER COLUMN provider_id DROP NOT NULL;