-- Drop the existing policy
DROP POLICY "Users can view their own bookings" ON public.bookings;

-- Create new policies with more specific access
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (((auth.uid())::text = (client_id)::text) OR ((auth.uid())::text = (provider_id)::text));

-- Allow providers to see available jobs (pending with no provider assigned)
CREATE POLICY "Providers can view available jobs" 
ON public.bookings 
FOR SELECT 
USING (status = 'pending' AND provider_id IS NULL);