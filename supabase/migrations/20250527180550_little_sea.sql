/*
  # Subscription and Analytics Schema

  1. New Tables
    - `subscriptions`: Stores user subscription data
    - `subscription_features`: Tracks feature usage limits
    - `post_analytics`: Tracks post performance
    - `referral_codes`: Stores referral codes for affiliates
    - `referral_earnings`: Tracks affiliate earnings

  2. Features
    - Four subscription tiers (free, standard, premium, business)
    - Usage tracking for generations and autoposting
    - Analytics for post performance
    - Referral system for admins

  3. Security
    - RLS enabled on all tables
    - Users can only view their own data
    - Admins have full access
*/

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  plan text NOT NULL CHECK (plan IN ('free', 'standard', 'premium', 'business')),
  price integer NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'expired')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscription_features table
CREATE TABLE IF NOT EXISTS subscription_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions NOT NULL,
  feature text NOT NULL,
  usage_limit integer NOT NULL,
  used integer NOT NULL DEFAULT 0,
  reset_at timestamptz NOT NULL,
  UNIQUE(subscription_id, feature)
);

-- Create post_analytics table
CREATE TABLE IF NOT EXISTS post_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES scheduled_posts NOT NULL,
  platform text NOT NULL,
  views integer NOT NULL DEFAULT 0,
  likes integer NOT NULL DEFAULT 0,
  comments integer NOT NULL DEFAULT 0,
  shares integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Create referral_codes table
CREATE TABLE IF NOT EXISTS referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  visits integer NOT NULL DEFAULT 0,
  registrations integer NOT NULL DEFAULT 0,
  active_subscriptions integer NOT NULL DEFAULT 0,
  total_earnings integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create referral_earnings table
CREATE TABLE IF NOT EXISTS referral_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code_id uuid REFERENCES referral_codes NOT NULL,
  subscription_id uuid REFERENCES subscriptions NOT NULL,
  amount integer NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'paid')),
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_earnings ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'isAdmin' = 'true'
  ));

-- Policies for subscription_features
CREATE POLICY "Users can view their own subscription features"
  ON subscription_features
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM subscriptions
    WHERE subscriptions.id = subscription_id
    AND subscriptions.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage subscription features"
  ON subscription_features
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'isAdmin' = 'true'
  ));

-- Policies for post_analytics
CREATE POLICY "Users can view their own post analytics"
  ON post_analytics
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM scheduled_posts
    WHERE scheduled_posts.id = post_id
    AND scheduled_posts.user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all analytics"
  ON post_analytics
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'isAdmin' = 'true'
  ));

-- Policies for referral_codes
CREATE POLICY "Admins can manage referral codes"
  ON referral_codes
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'isAdmin' = 'true'
  ));

-- Policies for referral_earnings
CREATE POLICY "Admins can manage referral earnings"
  ON referral_earnings
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'isAdmin' = 'true'
  ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referral_codes_updated_at
  BEFORE UPDATE ON referral_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();