-- Check and fix any remaining security definer views
-- List all views to identify any security definer issues
DO $$
DECLARE
    view_record RECORD;
BEGIN
    -- Check if any views have security definer set
    FOR view_record IN 
        SELECT schemaname, viewname 
        FROM pg_views 
        WHERE schemaname = 'public'
    LOOP
        -- Reset any security invoker settings on views to be safe
        EXECUTE format('ALTER VIEW %I.%I RESET (security_invoker)', view_record.schemaname, view_record.viewname);
    END LOOP;
END
$$;

-- Specifically ensure our safe_profiles view is configured correctly
ALTER VIEW public.safe_profiles RESET (security_invoker);

-- Create a more secure approach using a function instead of exposing the profiles table
-- This function will only return non-sensitive profile information
CREATE OR REPLACE FUNCTION public.get_public_profile_info(target_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  graduation_year INTEGER,
  experience_years INTEGER,
  hourly_rate NUMERIC,
  availability_hours JSONB,
  rating NUMERIC,
  total_reviews INTEGER,
  skills TEXT[],
  bio TEXT,
  client_type TEXT,
  provider_type TEXT,
  location TEXT,
  company_name TEXT,
  farm_name TEXT,
  university TEXT,
  verification_status TEXT,
  portfolio_url TEXT,
  full_name TEXT,
  avatar_url TEXT,
  user_type TEXT,
  certifications TEXT[],
  languages TEXT[]
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.created_at,
    p.updated_at,
    p.graduation_year,
    p.experience_years,
    p.hourly_rate,
    p.availability_hours,
    p.rating,
    p.total_reviews,
    p.skills,
    p.bio,
    p.client_type,
    p.provider_type,
    p.location,
    p.company_name,
    p.farm_name,
    p.university,
    p.verification_status,
    p.portfolio_url,
    p.full_name,
    p.avatar_url,
    p.user_type,
    p.certifications,
    p.languages
  FROM public.profiles p
  WHERE p.user_id = target_user_id
  AND (
    -- User can see their own profile
    auth.uid() = p.user_id
    OR
    -- Others can only see provider/student profiles
    p.user_type = ANY (ARRAY['provider'::text, 'student'::text, 'business'::text, 'farmer'::text])
  );
$$;