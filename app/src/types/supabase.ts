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
      themes: {
        Row: {
          id: string
          title: string
          subtitle: string
          description: string
          icon: string
          color: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle: string
          description: string
          icon: string
          color: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string
          description?: string
          icon?: string
          color?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      sections: {
        Row: {
          id: string
          theme_id: string
          type: 'method' | 'theory' | 'evidence' | 'overview'
          title: string
          content: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          theme_id: string
          type: 'method' | 'theory' | 'evidence' | 'overview'
          title: string
          content: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          theme_id?: string
          type?: 'method' | 'theory' | 'evidence' | 'overview'
          title?: string
          content?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      citations: {
        Row: {
          id: string
          theme_id: string
          number: number
          author: string
          year: number
          title: string
          source: string
          page: string
          url?: string
          created_at: string
        }
        Insert: {
          id?: string
          theme_id: string
          number: number
          author: string
          year: number
          title: string
          source: string
          page: string
          url?: string
          created_at?: string
        }
        Update: {
          id?: string
          theme_id?: string
          number?: number
          author?: string
          year?: number
          title?: string
          source?: string
          page?: string
          url?: string
          created_at?: string
        }
      }
      theme_stats: {
        Row: {
          id: string
          theme_id: string
          success_rate: number
          research_count: number
          participant_count: number
          avg_duration: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          theme_id: string
          success_rate: number
          research_count: number
          participant_count: number
          avg_duration: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          theme_id?: string
          success_rate?: number
          research_count?: number
          participant_count?: number
          avg_duration?: string
          created_at?: string
          updated_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          title: string
          content: string
          author: string
          email: string
          category: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author: string
          email: string
          category: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author?: string
          email?: string
          category?: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
      }
      discussions: {
        Row: {
          id: string
          title: string
          content: string
          author: string
          category: string
          replies: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author: string
          category: string
          replies?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author?: string
          category?: string
          replies?: number
          created_at?: string
        }
      }
      replies: {
        Row: {
          id: string
          discussion_id: string
          content: string
          author: string
          created_at: string
        }
        Insert: {
          id?: string
          discussion_id: string
          content: string
          author: string
          created_at?: string
        }
        Update: {
          id?: string
          discussion_id?: string
          content?: string
          author?: string
          created_at?: string
        }
      }
      admin_settings: {
        Row: {
          id: number
          password_hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          password_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          password_hash?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
