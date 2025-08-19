-- Fix security issue: Restrict access to sensitive personal information in profiles table

-- First, drop the overly permissive policy for viewing provider profiles
DROP POLICY IF EXISTS "Users can view provider profiles" ON public.profiles;

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

-- Create a more restrictive policy for viewing provider profiles
-- This allows viewing provider profiles but with contact info restrictions handled by application logic
CREATE POLICY "Users can view provider profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- Allow viewing provider profiles for legitimate business purposes
  (user_type = ANY (ARRAY['provider'::text, 'student'::text, 'business'::text, 'farmer'::text])) 
  OR 
  -- Always allow users to see their own profile
  (auth.uid() = user_id)
);

-- Create a view for safe profile access that automatically filters sensitive information
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
  -- Conditionally show contact information only when user has permission
  CASE 
    WHEN public.can_view_contact_info(user_id) THEN email 
    ELSE NULL 
  END as email,
  CASE 
    WHEN public.can_view_contact_info(user_id) THEN phone 
    ELSE NULL 
  END as phone
FROM public.profiles
WHERE 
  -- Apply the same visibility rules as the RLS policy
  (user_type = ANY (ARRAY['provider'::text, 'student'::text, 'business'::text, 'farmer'::text])) 
  OR (auth.uid() = user_id)
  OR (user_type = 'client'::text AND EXISTS (
    SELECT 1 
    FROM public.bookings 
    WHERE 
      ((bookings.client_id = profiles.user_id OR bookings.provider_id = profiles.user_id) 
      AND (bookings.client_id = auth.uid() OR bookings.provider_id = auth.uid()))
  ));

-- Grant access to the safe view for authenticated users
GRANT SELECT ON public.safe_profiles TO authenticated;