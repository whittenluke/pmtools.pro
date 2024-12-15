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
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          status: 'active' | 'completed' | 'archived'
          owner_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          status?: 'active' | 'completed' | 'archived'
          owner_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string | null
          status?: 'active' | 'completed' | 'archived'
          owner_id?: string
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'done'
          project_id: string
          assignee_id: string | null
          due_date: string | null
          start_date: string | null
          priority: 'low' | 'medium' | 'high'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          project_id: string
          assignee_id?: string | null
          due_date?: string | null
          start_date?: string | null
          priority?: 'low' | 'medium' | 'high'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          project_id?: string
          assignee_id?: string | null
          due_date?: string | null
          start_date?: string | null
          priority?: 'low' | 'medium' | 'high'
        }
      }
      project_members: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          project_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          project_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          project_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
        }
      }
      workspaces: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          owner_id: string
          settings: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          owner_id: string
          settings?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          owner_id?: string
          settings?: Json | null
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
  analytics: {
    Tables: {
      events: {
        Row: {
          id: string
          user_id: string | null
          workspace_id: string | null
          event_name: string
          properties: Json
          context: Json
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          workspace_id?: string | null
          event_name: string
          properties?: Json
          context?: Json
          session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          workspace_id?: string | null
          event_name?: string
          properties?: Json
          context?: Json
          session_id?: string | null
          created_at?: string
        }
      }
      page_views: {
        Row: {
          id: string
          user_id: string | null
          workspace_id: string | null
          path: string
          referrer: string | null
          user_agent: string | null
          duration: number | null
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          workspace_id?: string | null
          path: string
          referrer?: string | null
          user_agent?: string | null
          duration?: number | null
          session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          workspace_id?: string | null
          path?: string
          referrer?: string | null
          user_agent?: string | null
          duration?: number | null
          session_id?: string | null
          created_at?: string
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
  search: {
    Tables: {
      documents: {
        Row: {
          id: string
          workspace_id: string
          object_type: string
          object_id: string
          title: string
          content: string | null
          metadata: Json
          searchable_text: unknown
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          object_type: string
          object_id: string
          title: string
          content?: string | null
          metadata?: Json
          searchable_text?: unknown
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          object_type?: string
          object_id?: string
          title?: string
          content?: string | null
          metadata?: Json
          searchable_text?: unknown
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      search_documents: {
        Args: {
          p_workspace_id: string
          p_query: string
          p_filters?: Json
          p_types?: string[]
          p_offset?: number
          p_limit?: number
        }
        Returns: {
          id: string
          object_type: string
          object_id: string
          title: string
          content: string | null
          metadata: Json
          rank: number
          highlight_title: string[]
          highlight_content: string[]
        }[]
      }
      suggest_similar_terms: {
        Args: {
          p_workspace_id: string
          p_term: string
          p_limit?: number
        }
        Returns: {
          term: string
          similarity: number
        }[]
      }
      get_popular_searches: {
        Args: {
          p_workspace_id: string
          p_days?: number
          p_limit?: number
        }
        Returns: {
          query: string
          search_count: number
          avg_results: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
  rpc: {
    search_documents: (args: {
      p_workspace_id: string;
      p_query: string;
      p_filters?: Json;
      p_types?: string[];
      p_offset?: number;
      p_limit?: number;
    }) => Promise<{
      id: string;
      object_type: string;
      object_id: string;
      title: string;
      content: string | null;
      metadata: Json;
      rank: number;
      highlight_title: string[];
      highlight_content: string[];
    }[]>;
  }
} 