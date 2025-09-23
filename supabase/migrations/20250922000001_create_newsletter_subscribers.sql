-- Create newsletter_subscribers table
CREATE TABLE newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source text DEFAULT 'website',
  subscribed_at timestamp DEFAULT now(),
  buttondown_id text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to manage all data
CREATE POLICY "Service role can manage newsletter subscribers" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users to read their own subscription
CREATE POLICY "Users can read their own subscription" ON newsletter_subscribers
  FOR SELECT USING (auth.email() = email);

-- Add comment
COMMENT ON TABLE newsletter_subscribers IS 'Stores newsletter subscription data and syncs with Buttondown';