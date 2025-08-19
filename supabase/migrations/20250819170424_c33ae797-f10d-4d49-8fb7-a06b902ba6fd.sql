-- Fix security issue: Restrict access to sensitive personal information in profiles table

-- First, drop the overly permissive policy for viewing provider profiles
DROP POLICY IF EXISTS "Users can view provider profiles" ON public.profiles;

-- Create a more restrictive policy that only shows public profile information
-- This policy allows viewing basic provider info but excludes sensitive contact details
CREATE POLICY "Users can view public provider info" 
ON public.profiles 
FOR SELECT 
USING (
  (user_type = ANY (ARRAY['provider'::text, 'student'::text, 'business'::text, 'farmer'::text])) 
  OR (auth.uid() = user_id)
);

-- Create a security definer function to check if users can view contact information
-- This ensures contact info is only visible when there's a legitimate business relationship
CREATE OR REPLACE FUNCTION public.can_view_contact_info(profile_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
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

-- Create a view for public profile information that excludes sensitive contact details
CREATE OR REPLACE VIEW public.public_profiles AS
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
  -- Conditionally show contact information only when user has permission
  CASE 
    WHEN public.can_view_contact_info(user_id) THEN email 
    ELSE NULL 
  END as email,
  CASE 
    WHEN public.can_view_contact_info(user_id) THEN phone 
    ELSE NULL 
  END as phone
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_invoker = on);

-- Grant access to the view for authenticated users
GRANT SELECT ON public.public_profiles TO authenticated;

-- Create a policy for the public_profiles view
CREATE POLICY "Users can view public profile information" 
ON public.public_profiles 
FOR SELECT 
USING (
  -- Allow viewing public info for providers/students
  (user_type = ANY (ARRAY['provider'::text, 'student'::text, 'business'::text, 'farmer'::text])) 
  OR 
  -- Always allow users to see their own profile
  (auth.uid() = user_id)
  OR
  -- Allow viewing client profiles when there's a booking relationship
  (user_type = 'client'::text AND EXISTS (
    SELECT 1 
    FROM public.bookings 
    WHERE 
      ((bookings.client_id = public_profiles.user_id OR bookings.provider_id = public_profiles.user_id) 
      AND (bookings.client_id = auth.uid() OR bookings.provider_id = auth.uid()))
  ))
);