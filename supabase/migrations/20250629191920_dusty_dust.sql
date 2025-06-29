/*
  # Comprehensive SkillSwap AI Database Schema

  1. New Tables
    - `profiles` - Extended user profiles with personal information
    - `id_verification` - ID proof verification for providers
    - `providers` - Provider-specific information and business details
    - `provider_skills` - Skills associated with providers
    - `skills` - Master skills catalog
    - `categories` - Service categories
    - `services` - Services offered by providers
    - `service_requests` - Client service requests
    - `matches` - AI-powered matches between requests and providers
    - `bookings` - Booking and appointment management
    - `reviews` - Reviews and ratings
    - `messages` - Direct messaging system
    - `notifications` - System notifications
    - `payments` - Payment tracking
    - `portfolio_items` - Provider portfolio showcase
    - `certifications` - Professional certifications
    - `availability` - Provider availability schedules

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access
    - Secure file uploads for ID verification

  3. Features
    - Multi-country ID verification support
    - Comprehensive provider verification
    - Advanced matching system
    - Complete booking workflow
    - Payment integration ready
    - Portfolio management
    - Real-time messaging
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE user_role AS ENUM ('client', 'provider', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'in_review', 'verified', 'rejected');
CREATE TYPE id_type AS ENUM (
  'aadhaar', 'pan', 'passport', 'driving_license', 'voter_id', 'ration_card',
  'national_id', 'social_security', 'tax_id', 'work_permit', 'student_id'
);
CREATE TYPE availability_status AS ENUM ('available', 'busy', 'offline', 'vacation');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'system');
CREATE TYPE notification_type AS ENUM ('match', 'booking', 'payment', 'message', 'review', 'system');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  date_of_birth date,
  gender text,
  profile_image_url text,
  bio text,
  location text,
  country text DEFAULT 'India',
  state text,
  city text,
  postal_code text,
  role user_role DEFAULT 'client',
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ID Verification table
CREATE TABLE IF NOT EXISTS id_verification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  id_type id_type NOT NULL,
  id_number text NOT NULL,
  id_document_front_url text NOT NULL,
  id_document_back_url text,
  selfie_url text NOT NULL,
  verification_status verification_status DEFAULT 'pending',
  verified_at timestamptz,
  verified_by uuid REFERENCES profiles(id),
  rejection_reason text,
  expiry_date date,
  issued_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  icon text,
  color text,
  parent_id uuid REFERENCES categories(id),
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Providers table
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  business_name text,
  business_description text,
  business_registration_number text,
  tax_id text,
  hourly_rate_min decimal(10,2),
  hourly_rate_max decimal(10,2),
  currency text DEFAULT 'INR',
  experience_years integer,
  languages text[] DEFAULT '{}',
  service_radius integer, -- in kilometers
  is_mobile boolean DEFAULT false, -- can travel to client
  is_remote boolean DEFAULT true, -- can work remotely
  rating decimal(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  total_earnings decimal(12,2) DEFAULT 0,
  completion_rate decimal(5,2) DEFAULT 0,
  response_time_hours integer DEFAULT 24,
  availability_status availability_status DEFAULT 'available',
  is_featured boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  verification_badge text,
  joined_at timestamptz DEFAULT now(),
  last_active_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Provider Skills junction table
CREATE TABLE IF NOT EXISTS provider_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  experience_level text CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience integer,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(provider_id, skill_id)
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id),
  title text NOT NULL,
  description text NOT NULL,
  short_description text,
  price_type text CHECK (price_type IN ('hourly', 'fixed', 'package')) DEFAULT 'hourly',
  base_price decimal(10,2) NOT NULL,
  max_price decimal(10,2),
  currency text DEFAULT 'INR',
  duration_hours integer,
  includes text[],
  excludes text[],
  requirements text[],
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  order_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Service Requests table
CREATE TABLE IF NOT EXISTS service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id),
  title text NOT NULL,
  description text NOT NULL,
  location text,
  latitude decimal(10,8),
  longitude decimal(11,8),
  budget_min decimal(10,2),
  budget_max decimal(10,2),
  currency text DEFAULT 'INR',
  urgency text CHECK (urgency IN ('low', 'medium', 'high')) DEFAULT 'medium',
  preferred_date timestamptz,
  deadline timestamptz,
  is_remote boolean DEFAULT false,
  required_skills text[],
  status text CHECK (status IN ('open', 'matched', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
  ai_analysis jsonb, -- Store AI analysis results
  view_count integer DEFAULT 0,
  match_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Matches table (AI-powered matching)
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES service_requests(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id),
  confidence_score decimal(5,4) NOT NULL, -- AI confidence 0-1
  match_reasons text[],
  ai_analysis jsonb,
  status text CHECK (status IN ('pending', 'viewed', 'interested', 'contacted', 'hired', 'declined')) DEFAULT 'pending',
  provider_response text,
  quoted_price decimal(10,2),
  estimated_duration text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(request_id, provider_id)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id),
  request_id uuid REFERENCES service_requests(id),
  match_id uuid REFERENCES matches(id),
  title text NOT NULL,
  description text,
  scheduled_date timestamptz,
  duration_hours decimal(4,2),
  location text,
  is_remote boolean DEFAULT false,
  total_amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'INR',
  status booking_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  notes text,
  client_notes text,
  provider_notes text,
  cancellation_reason text,
  cancelled_by uuid REFERENCES profiles(id),
  cancelled_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title text,
  comment text,
  is_public boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id),
  message_type message_type DEFAULT 'text',
  content text,
  file_url text,
  file_name text,
  file_size integer,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  is_deleted boolean DEFAULT false,
  deleted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  payer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  payee_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'INR',
  payment_method text,
  transaction_id text UNIQUE,
  gateway_response jsonb,
  status payment_status DEFAULT 'pending',
  platform_fee decimal(10,2) DEFAULT 0,
  provider_amount decimal(10,2),
  processed_at timestamptz,
  refunded_at timestamptz,
  refund_amount decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Portfolio Items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_urls text[],
  project_url text,
  technologies_used text[],
  completion_date date,
  client_name text,
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  name text NOT NULL,
  issuing_organization text NOT NULL,
  issue_date date,
  expiry_date date,
  credential_id text,
  credential_url text,
  certificate_image_url text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Availability table
CREATE TABLE IF NOT EXISTS availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
  start_time time,
  end_time time,
  is_available boolean DEFAULT true,
  timezone text DEFAULT 'Asia/Kolkata',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(provider_id, day_of_week)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_id_verification_status ON id_verification(verification_status);
CREATE INDEX IF NOT EXISTS idx_id_verification_user ON id_verification(user_id);
CREATE INDEX IF NOT EXISTS idx_providers_user_id ON providers(user_id);
CREATE INDEX IF NOT EXISTS idx_providers_rating ON providers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_providers_availability ON providers(availability_status);
CREATE INDEX IF NOT EXISTS idx_providers_location ON providers(user_id); -- Will join with profiles for location
CREATE INDEX IF NOT EXISTS idx_provider_skills_provider ON provider_skills(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_skills_skill ON provider_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_services_provider ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_service_requests_user ON service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_category ON service_requests(category_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_location ON service_requests(location);
CREATE INDEX IF NOT EXISTS idx_matches_request ON matches(request_id);
CREATE INDEX IF NOT EXISTS idx_matches_provider ON matches(provider_id);
CREATE INDEX IF NOT EXISTS idx_matches_confidence ON matches(confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_provider ON portfolio_items(provider_id);
CREATE INDEX IF NOT EXISTS idx_certifications_provider ON certifications(provider_id);
CREATE INDEX IF NOT EXISTS idx_availability_provider ON availability(provider_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE id_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ID Verification policies
CREATE POLICY "Users can view own ID verification" ON id_verification FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ID verification" ON id_verification FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ID verification" ON id_verification FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all ID verifications" ON id_verification FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Categories policies (public read)
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (is_active = true);

-- Skills policies (public read)
CREATE POLICY "Anyone can view skills" ON skills FOR SELECT USING (is_active = true);

-- Providers policies
CREATE POLICY "Anyone can view verified providers" ON providers FOR SELECT USING (is_verified = true);
CREATE POLICY "Users can view own provider profile" ON providers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own provider profile" ON providers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own provider profile" ON providers FOR UPDATE USING (auth.uid() = user_id);

-- Provider Skills policies
CREATE POLICY "Anyone can view provider skills" ON provider_skills FOR SELECT USING (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND is_verified = true)
);
CREATE POLICY "Providers can manage own skills" ON provider_skills FOR ALL USING (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND user_id = auth.uid())
);

-- Services policies
CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Providers can manage own services" ON services FOR ALL USING (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND user_id = auth.uid())
);

-- Service Requests policies
CREATE POLICY "Users can view own requests" ON service_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Providers can view open requests" ON service_requests FOR SELECT USING (
  status = 'open' AND EXISTS (SELECT 1 FROM providers WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage own requests" ON service_requests FOR ALL USING (auth.uid() = user_id);

-- Matches policies
CREATE POLICY "Users can view matches for own requests" ON matches FOR SELECT USING (
  EXISTS (SELECT 1 FROM service_requests WHERE id = request_id AND user_id = auth.uid())
);
CREATE POLICY "Providers can view own matches" ON matches FOR SELECT USING (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND user_id = auth.uid())
);
CREATE POLICY "System can insert matches" ON matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Providers can update own matches" ON matches FOR UPDATE USING (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND user_id = auth.uid())
);

-- Bookings policies
CREATE POLICY "Users can view own bookings as client" ON bookings FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Users can view own bookings as provider" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert bookings as client" ON bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Users can update own bookings as client" ON bookings FOR UPDATE USING (auth.uid() = client_id);
CREATE POLICY "Providers can update own bookings" ON bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND user_id = auth.uid())
);

-- Reviews policies
CREATE POLICY "Anyone can view public reviews" ON reviews FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view reviews about them" ON reviews FOR SELECT USING (auth.uid() = reviewee_id);
CREATE POLICY "Users can insert reviews for completed bookings" ON reviews FOR INSERT WITH CHECK (
  auth.uid() = reviewer_id AND 
  EXISTS (SELECT 1 FROM bookings WHERE id = booking_id AND status = 'completed' AND 
    (client_id = auth.uid() OR EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND user_id = auth.uid())))
);

-- Messages policies
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = recipient_id
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON messages FOR UPDATE USING (auth.uid() = sender_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Payments policies
CREATE POLICY "Users can view own payments as payer" ON payments FOR SELECT USING (auth.uid() = payer_id);
CREATE POLICY "Users can view own payments as payee" ON payments FOR SELECT USING (auth.uid() = payee_id);
CREATE POLICY "System can manage payments" ON payments FOR ALL WITH CHECK (true);

-- Portfolio policies
CREATE POLICY "Anyone can view portfolio items" ON portfolio_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND is_verified = true)
);
CREATE POLICY "Providers can manage own portfolio" ON portfolio_items FOR ALL USING (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND user_id = auth.uid())
);

-- Certifications policies
CREATE POLICY "Anyone can view certifications" ON certifications FOR SELECT USING (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND is_verified = true)
);
CREATE POLICY "Providers can manage own certifications" ON certifications FOR ALL USING (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND user_id = auth.uid())
);

-- Availability policies
CREATE POLICY "Anyone can view provider availability" ON availability FOR SELECT USING (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND is_verified = true)
);
CREATE POLICY "Providers can manage own availability" ON availability FOR ALL USING (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND user_id = auth.uid())
);

-- Functions for triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_id_verification_updated_at BEFORE UPDATE ON id_verification FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON portfolio_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update provider rating
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE providers 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating::decimal), 0)
      FROM reviews 
      WHERE reviewee_id = (SELECT user_id FROM providers WHERE id = NEW.reviewee_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews 
      WHERE reviewee_id = (SELECT user_id FROM providers WHERE id = NEW.reviewee_id)
    )
  WHERE user_id = NEW.reviewee_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update provider rating when review is added
CREATE TRIGGER update_provider_rating_trigger 
  AFTER INSERT ON reviews 
  FOR EACH ROW 
  EXECUTE FUNCTION update_provider_rating();