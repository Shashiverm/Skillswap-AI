export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  location?: string;
  is_provider: boolean;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  created_at: string;
}

export interface Provider {
  id: string;
  user_id: string;
  business_name?: string;
  description: string;
  hourly_rate?: number;
  rating: number;
  total_reviews: number;
  availability: 'available' | 'busy' | 'offline';
  location: string;
  created_at: string;
  user?: User;
  skills?: ProviderSkill[];
}

export interface ProviderSkill {
  id: string;
  provider_id: string;
  skill_id: string;
  experience_level: 'beginner' | 'intermediate' | 'expert';
  skill?: Skill;
}

export interface ServiceRequest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget_min?: number;
  budget_max?: number;
  status: 'open' | 'matched' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  user?: User;
}

export interface Match {
  id: string;
  request_id: string;
  provider_id: string;
  confidence_score: number;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  provider?: Provider;
  request?: ServiceRequest;
}