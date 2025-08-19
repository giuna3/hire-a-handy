-- Fix security issues from the previous migration

-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION public.can_view_contact_info(profile_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT 
    -- User can always see their own contact info
    (auth.uid() = profile_user_id)
    OR
    -- Users can see contact info if they have an active booking relationship
    EXISTS (
      SELECT 1 
      FROM public.bookings 
      WHERE 
        (
          (bookings.client_id = profile_user_id AND bookings.provider_id = auth.uid()) 
          OR 
          (bookings.provider_id = profile_user_id AND bookings.client_id = auth.uid())
        )
        AND bookings.status IN ('confirmed', 'in_progress', 'completed')
    )
    OR
    -- Users can see contact info if they have pending applications
    EXISTS (
      SELECT 1 
      FROM public.applications a
      JOIN public.bookings b ON a.booking_id = b.id
      WHERE 
        (
          (b.client_id = profile_user_id AND a.provider_id = auth.uid()) 
          OR 
          (a.provider_id = profile_user_id AND b.client_id = auth.uid())
        )
        AND a.status = 'pending'
    );
$$;

-- Remove the problematic security definer view and replace with a regular view
DROP VIEW IF EXISTS public.safe_profiles;

-- Create a regular view without security definer
CREATE OR REPLACE VIEW public.safe_profiles AS
SELECT 
  id,
  user_id,
  created_at,
  updated_at,
  graduation_year,
  experience_years,
  hourly_rate,
  availability_hours,
  rating,
  total_reviews,
  skills,
  bio,
  client_type,
  provider_type,
  location,
  company_name,
  farm_name,
  university,
  verification_status,
  portfolio_url,
  full_name,
  avatar_url,
  user_type,
  certifications,
  languages,
  -- Show email/phone as null by default (contact info should be requested through proper channels)
  NULL as email,
  NULL as phone
FROM public.profiles
WHERE 
  -- Apply the same visibility rules as the RLS policy
  (user_type = ANY (ARRAY['provider'::text, 'student'::text, 'business'::text, 'farmer'::text])) 
  OR (auth.uid() = user_id);

-- Grant access to the safe view for authenticated users
GRANT SELECT ON public.safe_profiles TO authenticated;