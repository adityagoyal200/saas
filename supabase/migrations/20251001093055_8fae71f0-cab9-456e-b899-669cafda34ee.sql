-- Create webhook_endpoints table
CREATE TABLE public.webhook_endpoints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create webhook_requests table
CREATE TABLE public.webhook_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint_id UUID NOT NULL REFERENCES public.webhook_endpoints(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  headers JSONB,
  body JSONB,
  query_params JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for webhook_endpoints
CREATE POLICY "Users can view their own endpoints"
  ON public.webhook_endpoints FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own endpoints"
  ON public.webhook_endpoints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own endpoints"
  ON public.webhook_endpoints FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for webhook_requests
CREATE POLICY "Users can view requests for their endpoints"
  ON public.webhook_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.webhook_endpoints
      WHERE webhook_endpoints.id = webhook_requests.endpoint_id
      AND webhook_endpoints.user_id = auth.uid()
    )
  );

-- Enable realtime for webhook_requests
ALTER PUBLICATION supabase_realtime ADD TABLE public.webhook_requests;

-- Create index for better performance
CREATE INDEX idx_webhook_requests_endpoint_id ON public.webhook_requests(endpoint_id);
CREATE INDEX idx_webhook_requests_created_at ON public.webhook_requests(created_at DESC);