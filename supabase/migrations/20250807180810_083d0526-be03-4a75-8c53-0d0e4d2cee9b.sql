-- Update client_type constraint to remove student option
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_client_type_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_client_type_check 
CHECK (client_type IN ('client', 'business'));