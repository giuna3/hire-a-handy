-- Create applications table to track job applications
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policies for applications
CREATE POLICY "Providers can create applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (auth.uid()::text = provider_id::text);

CREATE POLICY "Providers can view their applications" 
ON public.applications 
FOR SELECT 
USING (auth.uid()::text = provider_id::text);

CREATE POLICY "Clients can view applications for their jobs" 
ON public.applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = applications.booking_id 
    AND bookings.client_id::text = auth.uid()::text
  )
);

CREATE POLICY "Clients can update application status" 
ON public.applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = applications.booking_id 
    AND bookings.client_id::text = auth.uid()::text
  )
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

-- Create triggers for updated_at
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new applications and send notifications
CREATE OR REPLACE FUNCTION public.handle_new_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create trigger for new applications
CREATE TRIGGER on_application_created
  AFTER INSERT ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_application();