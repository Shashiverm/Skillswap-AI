import { supabase } from './supabase';
import type { Database } from '../types/database';

type Tables = Database['public']['Tables'];
type Profile = Tables['profiles']['Row'];
type Provider = Tables['providers']['Row'];
type IdVerification = Tables['id_verification']['Row'];
type Category = Tables['categories']['Row'];
type Skill = Tables['skills']['Row'];
type Service = Tables['services']['Row'];
type ServiceRequest = Tables['service_requests']['Row'];
type Match = Tables['matches']['Row'];
type Booking = Tables['bookings']['Row'];
type Review = Tables['reviews']['Row'];
type Message = Tables['messages']['Row'];
type Notification = Tables['notifications']['Row'];
type Payment = Tables['payments']['Row'];
type PortfolioItem = Tables['portfolio_items']['Row'];
type Certification = Tables['certifications']['Row'];
type Availability = Tables['availability']['Row'];

// Profile operations
export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Tables['profiles']['Update']): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async createProfile(profile: Tables['profiles']['Insert']): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// ID Verification operations
export const idVerificationService = {
  async submitVerification(verification: Tables['id_verification']['Insert']): Promise<IdVerification> {
    const { data, error } = await supabase
      .from('id_verification')
      .insert(verification)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getVerificationStatus(userId: string): Promise<IdVerification | null> {
    const { data, error } = await supabase
      .from('id_verification')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateVerificationStatus(
    verificationId: string, 
    status: 'pending' | 'in_review' | 'verified' | 'rejected',
    verifiedBy?: string,
    rejectionReason?: string
  ): Promise<IdVerification> {
    const updates: any = { 
      verification_status: status,
      verified_at: status === 'verified' ? new Date().toISOString() : null
    };
    
    if (verifiedBy) updates.verified_by = verifiedBy;
    if (rejectionReason) updates.rejection_reason = rejectionReason;

    const { data, error } = await supabase
      .from('id_verification')
      .update(updates)
      .eq('id', verificationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Provider operations
export const providerService = {
  async createProvider(provider: Tables['providers']['Insert']): Promise<Provider> {
    const { data, error } = await supabase
      .from('providers')
      .insert(provider)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProvider(providerId: string): Promise<Provider | null> {
    const { data, error } = await supabase
      .from('providers')
      .select(`
        *,
        profiles!inner(*)
      `)
      .eq('id', providerId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProviderByUserId(userId: string): Promise<Provider | null> {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateProvider(providerId: string, updates: Tables['providers']['Update']): Promise<Provider> {
    const { data, error } = await supabase
      .from('providers')
      .update(updates)
      .eq('id', providerId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async searchProviders(filters: {
    category?: string;
    skills?: string[];
    location?: string;
    minRating?: number;
    availability?: string;
    priceRange?: [number, number];
  }): Promise<Provider[]> {
    let query = supabase
      .from('providers')
      .select(`
        *,
        profiles!inner(*),
        provider_skills!inner(
          skill_id,
          experience_level,
          skills!inner(name, category_id)
        )
      `)
      .eq('is_verified', true);

    if (filters.availability) {
      query = query.eq('availability_status', filters.availability);
    }

    if (filters.minRating) {
      query = query.gte('rating', filters.minRating);
    }

    if (filters.priceRange) {
      query = query
        .gte('hourly_rate_min', filters.priceRange[0])
        .lte('hourly_rate_max', filters.priceRange[1]);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }
};

// Category operations
export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    if (error) throw error;
    return data || [];
  },

  async getCategory(categoryId: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Skill operations
export const skillService = {
  async getSkills(categoryId?: string): Promise<Skill[]> {
    let query = supabase
      .from('skills')
      .select('*')
      .eq('is_active', true);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.order('name');
    
    if (error) throw error;
    return data || [];
  },

  async searchSkills(searchTerm: string): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('is_active', true)
      .ilike('name', `%${searchTerm}%`)
      .order('name')
      .limit(10);
    
    if (error) throw error;
    return data || [];
  }
};

// Service Request operations
export const serviceRequestService = {
  async createRequest(request: Tables['service_requests']['Insert']): Promise<ServiceRequest> {
    const { data, error } = await supabase
      .from('service_requests')
      .insert(request)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getRequest(requestId: string): Promise<ServiceRequest | null> {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        profiles!inner(*),
        categories(*)
      `)
      .eq('id', requestId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserRequests(userId: string): Promise<ServiceRequest[]> {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        categories(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getOpenRequests(filters?: {
    category?: string;
    location?: string;
    urgency?: string;
  }): Promise<ServiceRequest[]> {
    let query = supabase
      .from('service_requests')
      .select(`
        *,
        profiles!inner(*),
        categories(*)
      `)
      .eq('status', 'open');

    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters?.urgency) {
      query = query.eq('urgency', filters.urgency);
    }

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};

// Match operations
export const matchService = {
  async createMatch(match: Tables['matches']['Insert']): Promise<Match> {
    const { data, error } = await supabase
      .from('matches')
      .insert(match)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getMatchesForRequest(requestId: string): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        providers!inner(
          *,
          profiles!inner(*)
        )
      `)
      .eq('request_id', requestId)
      .order('confidence_score', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getMatchesForProvider(providerId: string): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        service_requests!inner(
          *,
          profiles!inner(*)
        )
      `)
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async updateMatchStatus(
    matchId: string, 
    status: 'pending' | 'viewed' | 'interested' | 'contacted' | 'hired' | 'declined',
    response?: string,
    quotedPrice?: number
  ): Promise<Match> {
    const updates: any = { status };
    if (response) updates.provider_response = response;
    if (quotedPrice) updates.quoted_price = quotedPrice;

    const { data, error } = await supabase
      .from('matches')
      .update(updates)
      .eq('id', matchId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Booking operations
export const bookingService = {
  async createBooking(booking: Tables['bookings']['Insert']): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getBooking(bookingId: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        client:profiles!client_id(*),
        provider:providers!provider_id(
          *,
          profiles!inner(*)
        )
      `)
      .eq('id', bookingId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserBookings(userId: string, role: 'client' | 'provider'): Promise<Booking[]> {
    const column = role === 'client' ? 'client_id' : 'provider_id';
    
    let query = supabase
      .from('bookings')
      .select(`
        *,
        client:profiles!client_id(*),
        provider:providers!provider_id(
          *,
          profiles!inner(*)
        )
      `);

    if (role === 'client') {
      query = query.eq('client_id', userId);
    } else {
      // For providers, we need to join through the providers table
      query = query.eq('provider_id', userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async updateBookingStatus(
    bookingId: string, 
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed',
    notes?: string
  ): Promise<Booking> {
    const updates: any = { status };
    if (notes) updates.notes = notes;
    if (status === 'completed') updates.completed_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Review operations
export const reviewService = {
  async createReview(review: Tables['reviews']['Insert']): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProviderReviews(providerId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviewer_id(full_name, profile_image_url)
      `)
      .eq('reviewee_id', providerId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};

// Message operations
export const messageService = {
  async sendMessage(message: Tables['messages']['Insert']): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getConversation(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!sender_id(full_name, profile_image_url),
        recipient:profiles!recipient_id(full_name, profile_image_url)
      `)
      .eq('conversation_id', conversationId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getUserConversations(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        conversation_id,
        sender_id,
        recipient_id,
        content,
        created_at,
        is_read,
        sender:profiles!sender_id(full_name, profile_image_url),
        recipient:profiles!recipient_id(full_name, profile_image_url)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });
    
    if (error) throw error;

    // Group by conversation and get latest message for each
    const conversations = new Map();
    data?.forEach(message => {
      if (!conversations.has(message.conversation_id)) {
        conversations.set(message.conversation_id, message);
      }
    });

    return Array.from(conversations.values());
  },

  async markAsRead(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', messageId);
    
    if (error) throw error;
  }
};

// Notification operations
export const notificationService = {
  async createNotification(notification: Tables['notifications']['Insert']): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserNotifications(userId: string, unreadOnly = false): Promise<Notification[]> {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', notificationId);
    
    if (error) throw error;
  }
};

// File upload helper
export const fileUploadService = {
  async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options?: { cacheControl?: string; upsert?: boolean }
  ): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, options);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return publicUrl;
  },

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw error;
  }
};