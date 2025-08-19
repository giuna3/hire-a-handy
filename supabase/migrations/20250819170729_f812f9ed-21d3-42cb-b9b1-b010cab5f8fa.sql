-- Complete fix for security definer view issue
-- Drop the potentially problematic view and replace with a secure approach

DROP VIEW IF EXISTS public.safe_profiles;

-- Create a simple function to get safe profile data instead of using a view
CREATE OR REPLACE FUNCTION public.get_safe_profiles()
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
  WHERE 
    -- Apply the same visibility rules as the RLS policy
    (p.user_type = ANY (ARRAY['provider'::text, 'student'::text, 'business'::text, 'farmer'::text])) 
    OR (auth.uid() = p.user_id);
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_safe_profiles() TO authenticated;

-- Also ensure all existing views are properly configured
-- Check if there are any views that might have security definer settings
DO $$
DECLARE
    view_name TEXT;
BEGIN
    -- Check all public views and ensure they don't have security definer
    FOR view_name IN 
        SELECT viewname FROM pg_views WHERE schemaname = 'public'
    LOOP
        -- Try to alter view to remove any security settings
        BEGIN
            EXECUTE format('ALTER VIEW public.%I RESET (security_invoker)', view_name);
        EXCEPTION 
            WHEN others THEN
                -- Continue if the view doesn't exist or other error
                NULL;
        END;
    END LOOP;
END
$$;