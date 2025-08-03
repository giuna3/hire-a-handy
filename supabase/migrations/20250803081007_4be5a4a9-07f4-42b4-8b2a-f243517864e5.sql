-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.handle_new_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  client_id_var UUID;
  provider_name TEXT;
BEGIN
  -- Get client_id from booking
  SELECT client_id INTO client_id_var
  FROM public.bookings
  WHERE id = NEW.booking_id;
  
  -- Get provider name
  SELECT full_name INTO provider_name
  FROM public.profiles
  WHERE user_id = NEW.provider_id;
  
  -- Create notification for client
  INSERT INTO public.notifications (user_id, title, message, type, data)
  VALUES (
    client_id_var,
    'New Job Application',
    COALESCE(provider_name, 'A provider') || ' has applied to your job listing',
    'application',
    jsonb_build_object(
      'booking_id', NEW.booking_id,
      'application_id', NEW.id,
      'provider_id', NEW.provider_id
    )
  );
  
  RETURN NEW;
END;
$$;