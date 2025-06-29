export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone?: string;
          date_of_birth?: string;
          gender?: string;
          profile_image_url?: string;
          bio?: string;
          location?: string;
          country: string;
          state?: string;
          city?: string;
          postal_code?: string;
          role: 'client' | 'provider' | 'admin';
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string;
          date_of_birth?: string;
          gender?: string;
          profile_image_url?: string;
          bio?: string;
          location?: string;
          country?: string;
          state?: string;
          city?: string;
          postal_code?: string;
          role?: 'client' | 'provider' | 'admin';
          is_verified?: boolean;
        };
        Update: {
          email?: string;
          full_name?: string;
          phone?: string;
          date_of_birth?: string;
          gender?: string;
          profile_image_url?: string;
          bio?: string;
          location?: string;
          country?: string;
          state?: string;
          city?: string;
          postal_code?: string;
          role?: 'client' | 'provider' | 'admin';
          is_verified?: boolean;
        };
      };
      id_verification: {
        Row: {
          id: string;
          user_id: string;
          id_type: 'aadhaar' | 'pan' | 'passport' | 'driving_license' | 'voter_id' | 'ration_card' | 'national_id' | 'social_security' | 'tax_id' | 'work_permit' | 'student_id';
          id_number: string;
          id_document_front_url: string;
          id_document_back_url?: string;
          selfie_url: string;
          verification_status: 'pending' | 'in_review' | 'verified' | 'rejected';
          verified_at?: string;
          verified_by?: string;
          rejection_reason?: string;
          expiry_date?: string;
          issued_by?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          id_type: 'aadhaar' | 'pan' | 'passport' | 'driving_license' | 'voter_id' | 'ration_card' | 'national_id' | 'social_security' | 'tax_id' | 'work_permit' | 'student_id';
          id_number: string;
          id_document_front_url: string;
          id_document_back_url?: string;
          selfie_url: string;
          expiry_date?: string;
          issued_by?: string;
        };
        Update: {
          id_type?: 'aadhaar' | 'pan' | 'passport' | 'driving_license' | 'voter_id' | 'ration_card' | 'national_id' | 'social_security' | 'tax_id' | 'work_permit' | 'student_id';
          id_number?: string;
          id_document_front_url?: string;
          id_document_back_url?: string;
          selfie_url?: string;
          verification_status?: 'pending' | 'in_review' | 'verified' | 'rejected';
          verified_at?: string;
          verified_by?: string;
          rejection_reason?: string;
          expiry_date?: string;
          issued_by?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description?: string;
          icon?: string;
          color?: string;
          parent_id?: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          name: string;
          description?: string;
          icon?: string;
          color?: string;
          parent_id?: string;
          is_active?: boolean;
          sort_order?: number;
        };
        Update: {
          name?: string;
          description?: string;
          icon?: string;
          color?: string;
          parent_id?: string;
          is_active?: boolean;
          sort_order?: number;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          description?: string;
          category_id?: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          description?: string;
          category_id?: string;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          description?: string;
          category_id?: string;
          is_active?: boolean;
        };
      };
      providers: {
        Row: {
          id: string;
          user_id: string;
          business_name?: string;
          business_description?: string;
          business_registration_number?: string;
          tax_id?: string;
          hourly_rate_min?: number;
          hourly_rate_max?: number;
          currency: string;
          experience_years?: number;
          languages: string[];
          service_radius?: number;
          is_mobile: boolean;
          is_remote: boolean;
          rating: number;
          total_reviews: number;
          total_earnings: number;
          completion_rate: number;
          response_time_hours: number;
          availability_status: 'available' | 'busy' | 'offline' | 'vacation';
          is_featured: boolean;
          is_verified: boolean;
          verification_badge?: string;
          joined_at: string;
          last_active_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          business_name?: string;
          business_description?: string;
          business_registration_number?: string;
          tax_id?: string;
          hourly_rate_min?: number;
          hourly_rate_max?: number;
          currency?: string;
          experience_years?: number;
          languages?: string[];
          service_radius?: number;
          is_mobile?: boolean;
          is_remote?: boolean;
          is_featured?: boolean;
          verification_badge?: string;
        };
        Update: {
          business_name?: string;
          business_description?: string;
          business_registration_number?: string;
          tax_id?: string;
          hourly_rate_min?: number;
          hourly_rate_max?: number;
          currency?: string;
          experience_years?: number;
          languages?: string[];
          service_radius?: number;
          is_mobile?: boolean;
          is_remote?: boolean;
          availability_status?: 'available' | 'busy' | 'offline' | 'vacation';
          is_featured?: boolean;
          verification_badge?: string;
          last_active_at?: string;
        };
      };
      provider_skills: {
        Row: {
          id: string;
          provider_id: string;
          skill_id: string;
          experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
          years_experience?: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          provider_id: string;
          skill_id: string;
          experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
          years_experience?: number;
          is_primary?: boolean;
        };
        Update: {
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
          years_experience?: number;
          is_primary?: boolean;
        };
      };
      services: {
        Row: {
          id: string;
          provider_id: string;
          category_id?: string;
          title: string;
          description: string;
          short_description?: string;
          price_type: 'hourly' | 'fixed' | 'package';
          base_price: number;
          max_price?: number;
          currency: string;
          duration_hours?: number;
          includes?: string[];
          excludes?: string[];
          requirements?: string[];
          is_active: boolean;
          is_featured: boolean;
          view_count: number;
          order_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          provider_id: string;
          category_id?: string;
          title: string;
          description: string;
          short_description?: string;
          price_type?: 'hourly' | 'fixed' | 'package';
          base_price: number;
          max_price?: number;
          currency?: string;
          duration_hours?: number;
          includes?: string[];
          excludes?: string[];
          requirements?: string[];
          is_active?: boolean;
          is_featured?: boolean;
        };
        Update: {
          category_id?: string;
          title?: string;
          description?: string;
          short_description?: string;
          price_type?: 'hourly' | 'fixed' | 'package';
          base_price?: number;
          max_price?: number;
          currency?: string;
          duration_hours?: number;
          includes?: string[];
          excludes?: string[];
          requirements?: string[];
          is_active?: boolean;
          is_featured?: boolean;
        };
      };
      service_requests: {
        Row: {
          id: string;
          user_id: string;
          category_id?: string;
          title: string;
          description: string;
          location?: string;
          latitude?: number;
          longitude?: number;
          budget_min?: number;
          budget_max?: number;
          currency: string;
          urgency: 'low' | 'medium' | 'high';
          preferred_date?: string;
          deadline?: string;
          is_remote: boolean;
          required_skills?: string[];
          status: 'open' | 'matched' | 'in_progress' | 'completed' | 'cancelled';
          ai_analysis?: any;
          view_count: number;
          match_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          category_id?: string;
          title: string;
          description: string;
          location?: string;
          latitude?: number;
          longitude?: number;
          budget_min?: number;
          budget_max?: number;
          currency?: string;
          urgency?: 'low' | 'medium' | 'high';
          preferred_date?: string;
          deadline?: string;
          is_remote?: boolean;
          required_skills?: string[];
          ai_analysis?: any;
        };
        Update: {
          category_id?: string;
          title?: string;
          description?: string;
          location?: string;
          latitude?: number;
          longitude?: number;
          budget_min?: number;
          budget_max?: number;
          currency?: string;
          urgency?: 'low' | 'medium' | 'high';
          preferred_date?: string;
          deadline?: string;
          is_remote?: boolean;
          required_skills?: string[];
          status?: 'open' | 'matched' | 'in_progress' | 'completed' | 'cancelled';
          ai_analysis?: any;
        };
      };
      matches: {
        Row: {
          id: string;
          request_id: string;
          provider_id: string;
          service_id?: string;
          confidence_score: number;
          match_reasons?: string[];
          ai_analysis?: any;
          status: 'pending' | 'viewed' | 'interested' | 'contacted' | 'hired' | 'declined';
          provider_response?: string;
          quoted_price?: number;
          estimated_duration?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          request_id: string;
          provider_id: string;
          service_id?: string;
          confidence_score: number;
          match_reasons?: string[];
          ai_analysis?: any;
          provider_response?: string;
          quoted_price?: number;
          estimated_duration?: string;
        };
        Update: {
          status?: 'pending' | 'viewed' | 'interested' | 'contacted' | 'hired' | 'declined';
          provider_response?: string;
          quoted_price?: number;
          estimated_duration?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          client_id: string;
          provider_id: string;
          service_id?: string;
          request_id?: string;
          match_id?: string;
          title: string;
          description?: string;
          scheduled_date?: string;
          duration_hours?: number;
          location?: string;
          is_remote: boolean;
          total_amount: number;
          currency: string;
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
          payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
          notes?: string;
          client_notes?: string;
          provider_notes?: string;
          cancellation_reason?: string;
          cancelled_by?: string;
          cancelled_at?: string;
          completed_at?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          client_id: string;
          provider_id: string;
          service_id?: string;
          request_id?: string;
          match_id?: string;
          title: string;
          description?: string;
          scheduled_date?: string;
          duration_hours?: number;
          location?: string;
          is_remote?: boolean;
          total_amount: number;
          currency?: string;
          notes?: string;
          client_notes?: string;
          provider_notes?: string;
        };
        Update: {
          scheduled_date?: string;
          duration_hours?: number;
          location?: string;
          is_remote?: boolean;
          total_amount?: number;
          currency?: string;
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
          payment_status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
          notes?: string;
          client_notes?: string;
          provider_notes?: string;
          cancellation_reason?: string;
          cancelled_by?: string;
          cancelled_at?: string;
          completed_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          title?: string;
          comment?: string;
          is_public: boolean;
          is_verified: boolean;
          helpful_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          booking_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          title?: string;
          comment?: string;
          is_public?: boolean;
        };
        Update: {
          rating?: number;
          title?: string;
          comment?: string;
          is_public?: boolean;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          recipient_id: string;
          booking_id?: string;
          message_type: 'text' | 'image' | 'file' | 'system';
          content?: string;
          file_url?: string;
          file_name?: string;
          file_size?: number;
          is_read: boolean;
          read_at?: string;
          is_deleted: boolean;
          deleted_at?: string;
          created_at: string;
        };
        Insert: {
          conversation_id: string;
          sender_id: string;
          recipient_id: string;
          booking_id?: string;
          message_type?: 'text' | 'image' | 'file' | 'system';
          content?: string;
          file_url?: string;
          file_name?: string;
          file_size?: number;
        };
        Update: {
          content?: string;
          is_read?: boolean;
          read_at?: string;
          is_deleted?: boolean;
          deleted_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'match' | 'booking' | 'payment' | 'message' | 'review' | 'system';
          title: string;
          message: string;
          data?: any;
          is_read: boolean;
          read_at?: string;
          action_url?: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: 'match' | 'booking' | 'payment' | 'message' | 'review' | 'system';
          title: string;
          message: string;
          data?: any;
          action_url?: string;
        };
        Update: {
          is_read?: boolean;
          read_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          booking_id: string;
          payer_id: string;
          payee_id: string;
          amount: number;
          currency: string;
          payment_method?: string;
          transaction_id?: string;
          gateway_response?: any;
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
          platform_fee: number;
          provider_amount?: number;
          processed_at?: string;
          refunded_at?: string;
          refund_amount?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          booking_id: string;
          payer_id: string;
          payee_id: string;
          amount: number;
          currency?: string;
          payment_method?: string;
          transaction_id?: string;
          gateway_response?: any;
          platform_fee?: number;
          provider_amount?: number;
        };
        Update: {
          payment_method?: string;
          transaction_id?: string;
          gateway_response?: any;
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
          provider_amount?: number;
          processed_at?: string;
          refunded_at?: string;
          refund_amount?: number;
        };
      };
      portfolio_items: {
        Row: {
          id: string;
          provider_id: string;
          title: string;
          description?: string;
          image_urls?: string[];
          project_url?: string;
          technologies_used?: string[];
          completion_date?: string;
          client_name?: string;
          is_featured: boolean;
          view_count: number;
          like_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          provider_id: string;
          title: string;
          description?: string;
          image_urls?: string[];
          project_url?: string;
          technologies_used?: string[];
          completion_date?: string;
          client_name?: string;
          is_featured?: boolean;
        };
        Update: {
          title?: string;
          description?: string;
          image_urls?: string[];
          project_url?: string;
          technologies_used?: string[];
          completion_date?: string;
          client_name?: string;
          is_featured?: boolean;
        };
      };
      certifications: {
        Row: {
          id: string;
          provider_id: string;
          name: string;
          issuing_organization: string;
          issue_date?: string;
          expiry_date?: string;
          credential_id?: string;
          credential_url?: string;
          certificate_image_url?: string;
          is_verified: boolean;
          created_at: string;
        };
        Insert: {
          provider_id: string;
          name: string;
          issuing_organization: string;
          issue_date?: string;
          expiry_date?: string;
          credential_id?: string;
          credential_url?: string;
          certificate_image_url?: string;
        };
        Update: {
          name?: string;
          issuing_organization?: string;
          issue_date?: string;
          expiry_date?: string;
          credential_id?: string;
          credential_url?: string;
          certificate_image_url?: string;
          is_verified?: boolean;
        };
      };
      availability: {
        Row: {
          id: string;
          provider_id: string;
          day_of_week: number;
          start_time?: string;
          end_time?: string;
          is_available: boolean;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          provider_id: string;
          day_of_week: number;
          start_time?: string;
          end_time?: string;
          is_available?: boolean;
          timezone?: string;
        };
        Update: {
          start_time?: string;
          end_time?: string;
          is_available?: boolean;
          timezone?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'client' | 'provider' | 'admin';
      verification_status: 'pending' | 'in_review' | 'verified' | 'rejected';
      id_type: 'aadhaar' | 'pan' | 'passport' | 'driving_license' | 'voter_id' | 'ration_card' | 'national_id' | 'social_security' | 'tax_id' | 'work_permit' | 'student_id';
      availability_status: 'available' | 'busy' | 'offline' | 'vacation';
      booking_status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
      payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
      message_type: 'text' | 'image' | 'file' | 'system';
      notification_type: 'match' | 'booking' | 'payment' | 'message' | 'review' | 'system';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}