export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          location: string | null
          timezone: string | null
          language: string
          role: string
          judge_title: string | null
          judge_bio: string | null
          judge_specialties: string[] | null
          is_accepting_bookings: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          location?: string | null
          timezone?: string | null
          language?: string
          role?: string
          judge_title?: string | null
          judge_bio?: string | null
          judge_specialties?: string[] | null
          is_accepting_bookings?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          location?: string | null
          timezone?: string | null
          language?: string
          role?: string
          judge_title?: string | null
          judge_bio?: string | null
          judge_specialties?: string[] | null
          is_accepting_bookings?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          user_id: string
          assigned_judge_id: string | null
          parent_appointment_id: string | null
          consultation_type: 'initial' | 'followUp' | 'standard' | 'premium' | 'documentReview'
          title: string
          description: string | null
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          client_notes: string | null
          judge_notes: string | null
          internal_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          assigned_judge_id?: string | null
          parent_appointment_id?: string | null
          consultation_type?: 'initial' | 'followUp' | 'standard' | 'premium' | 'documentReview'
          title: string
          description?: string | null
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          client_notes?: string | null
          judge_notes?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          assigned_judge_id?: string | null
          parent_appointment_id?: string | null
          consultation_type?: 'initial' | 'followUp' | 'standard' | 'premium' | 'documentReview'
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          client_notes?: string | null
          judge_notes?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          appointment_id: string | null
          name: string
          type: string
          file_url: string
          file_size: number
          mime_type: string
          uploaded_by: string
          description: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          appointment_id?: string | null
          name: string
          type: string
          file_url: string
          file_size: number
          mime_type: string
          uploaded_by?: string
          description?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          appointment_id?: string | null
          name?: string
          type?: string
          file_url?: string
          file_size?: number
          mime_type?: string
          uploaded_by?: string
          description?: string | null
          uploaded_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          stripe_payment_id: string
          amount: number
          currency: string
          status: 'pending' | 'succeeded' | 'failed' | 'refunded'
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_id: string
          amount: number
          currency: string
          status?: 'pending' | 'succeeded' | 'failed' | 'refunded'
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_payment_id?: string
          amount?: number
          currency?: string
          status?: 'pending' | 'succeeded' | 'failed' | 'refunded'
          description?: string | null
          created_at?: string
        }
      }
    }
  }
}
