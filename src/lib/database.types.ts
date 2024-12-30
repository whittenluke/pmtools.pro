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
      activity_log: {
        Row: {
          id: string
          created_at: string
          action: string
          project_id: string | null
          task_id: string | null
          user_id: string | null
          details: Json
        }
        Insert: {
          id?: string
          created_at?: string
          action: string
          project_id?: string | null
          task_id?: string | null
          user_id?: string | null
          details: Json
        }
        Update: {
          id?: string
          created_at?: string
          action?: string
          project_id?: string | null
          task_id?: string | null
          user_id?: string | null
          details?: Json
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          created_by: string | null
          settings: Json
          workspace_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          created_by?: string | null
          settings?: Json
          workspace_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string | null
          created_by?: string | null
          settings?: Json
          workspace_id?: string | null
        }
      }
      project_views: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          type: string | null
          project_id: string | null
          status_config: Json
          columns: Json
          config: Json
          is_default: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          type?: string | null
          project_id?: string | null
          status_config?: Json
          columns?: Json
          config?: Json
          is_default?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          type?: string | null
          project_id?: string | null
          status_config?: Json
          columns?: Json
          config?: Json
          is_default?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          status_id: string
          project_id: string | null
          group_id: string | null
          assignee_id: string | null
          due_date: string | null
          position: number
          column_values: Json
          metadata: Json
          created_by: string | null
          search_text: unknown | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          status_id?: string
          project_id?: string | null
          group_id?: string | null
          assignee_id?: string | null
          due_date?: string | null
          position: number
          column_values?: Json
          metadata?: Json
          created_by?: string | null
          search_text?: unknown | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string | null
          status_id?: string
          project_id?: string | null
          group_id?: string | null
          assignee_id?: string | null
          due_date?: string | null
          position?: number
          column_values?: Json
          metadata?: Json
          created_by?: string | null
          search_text?: unknown | null
        }
      }
      workspace_members: {
        Row: {
          user_id: string
          workspace_id: string
          role: string
          permissions: Json
          joined_at: string
        }
        Insert: {
          user_id: string
          workspace_id: string
          role: string
          permissions?: Json
          joined_at?: string
        }
        Update: {
          user_id?: string
          workspace_id?: string
          role?: string
          permissions?: Json
          joined_at?: string
        }
      }
      workspaces: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          slug: string
          settings: Json
          features: Json
          limits: Json
          branding: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          slug: string
          settings?: Json
          features?: Json
          limits?: Json
          branding?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          slug?: string
          settings?: Json
          features?: Json
          limits?: Json
          branding?: Json
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