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
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          file_url: string
          file_size: number
          mime_type: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          file_url: string
          file_size: number
          mime_type: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          file_url?: string
          file_size?: number
          mime_type?: string
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
