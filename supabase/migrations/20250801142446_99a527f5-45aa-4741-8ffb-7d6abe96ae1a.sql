-- Create messages table for chat functionality
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  message_text TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  file_url TEXT,
  file_size INTEGER,
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for message access
CREATE POLICY "Users can view messages they sent or received" 
ON public.messages 
FOR SELECT 
USING (
  (auth.uid())::text = (sender_id)::text OR 
  (auth.uid())::text = (recipient_id)::text
);

CREATE POLICY "Users can insert their own messages" 
ON public.messages 
FOR INSERT 
WITH CHECK ((auth.uid())::text = (sender_id)::text);

CREATE POLICY "Users can update their own messages" 
ON public.messages 
FOR UPDATE 
USING ((auth.uid())::text = (sender_id)::text);

-- Create function to update timestamps
CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_messages_sender_recipient ON public.messages (sender_id, recipient_id);
CREATE INDEX idx_messages_created_at ON public.messages (created_at DESC);