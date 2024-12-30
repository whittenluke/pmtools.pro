export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json
          id: string
          project_id: string | null
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details: Json
          id?: string
          project_id?: string | null
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json
          id?: string
          project_id?: string | null
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_logs: {
        Row: {
          automation_id: string | null
          created_at: string | null
          details: Json
          error: string | null
          id: string
          status: string
          trigger_type: string
        }
        Insert: {
          automation_id?: string | null
          created_at?: string | null
          details: Json
          error?: string | null
          id?: string
          status: string
          trigger_type: string
        }
        Update: {
          automation_id?: string | null
          created_at?: string | null
          details?: Json
          error?: string | null
          id?: string
          status?: string
          trigger_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_logs_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
        ]
      }
      automations: {
        Row: {
          actions: Json
          conditions: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          enabled: boolean | null
          id: string
          name: string
          project_id: string | null
          trigger: Json
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          actions: Json
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          name: string
          project_id?: string | null
          trigger: Json
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          actions?: Json
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          name?: string
          project_id?: string | null
          trigger?: Json
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string | null
          id: string
          is_resolved: boolean | null
          search_text: unknown | null
          task_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          search_text?: unknown | null
          task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          search_text?: unknown | null
          task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      export_jobs: {
        Row: {
          config: Json
          created_at: string | null
          created_by: string | null
          error: string | null
          file_url: string | null
          format: string
          id: string
          status: string
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          config: Json
          created_at?: string | null
          created_by?: string | null
          error?: string | null
          file_url?: string | null
          format: string
          id?: string
          status: string
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          created_by?: string | null
          error?: string | null
          file_url?: string | null
          format?: string
          id?: string
          status?: string
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "export_jobs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          position: number
          project_id: string | null
          settings: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          position: number
          project_id?: string | null
          settings?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          position?: number
          project_id?: string | null
          settings?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      import_jobs: {
        Row: {
          config: Json
          created_at: string | null
          created_by: string | null
          error: string | null
          id: string
          progress: number | null
          source: string
          status: string
          total: number | null
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          config: Json
          created_at?: string | null
          created_by?: string | null
          error?: string | null
          id?: string
          progress?: number | null
          source: string
          status: string
          total?: number | null
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          created_by?: string | null
          error?: string | null
          id?: string
          progress?: number | null
          source?: string
          status?: string
          total?: number | null
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "import_jobs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          link: string | null
          metadata: Json | null
          project_id: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          metadata?: Json | null
          project_id?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          metadata?: Json | null
          project_id?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      permission_sets: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_custom: boolean | null
          name: string
          permissions: Json
          priority: number
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_custom?: boolean | null
          name: string
          permissions: Json
          priority: number
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_custom?: boolean | null
          name?: string
          permissions?: Json
          priority?: number
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permission_sets_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_templates: {
        Row: {
          config: Json
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          title: string
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          config: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          title: string
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          title?: string
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_templates_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      project_views: {
        Row: {
          columns: Json | null
          config: Json | null
          created_at: string | null
          id: string
          is_default: boolean | null
          project_id: string | null
          status_config: Json | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          columns?: Json | null
          config?: Json | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          project_id?: string | null
          status_config?: Json | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          columns?: Json | null
          config?: Json | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          project_id?: string | null
          status_config?: Json | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_views_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          settings: Json | null
          title: string
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          settings?: Json | null
          title: string
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          settings?: Json | null
          title?: string
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_permissions: {
        Row: {
          conditions: Json | null
          created_at: string | null
          grantee_id: string
          grantee_type: string
          id: string
          permission_set_id: string | null
          resource_id: string
          resource_type: string
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          conditions?: Json | null
          created_at?: string | null
          grantee_id: string
          grantee_type: string
          id?: string
          permission_set_id?: string | null
          resource_id: string
          resource_type: string
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          conditions?: Json | null
          created_at?: string | null
          grantee_id?: string
          grantee_type?: string
          id?: string
          permission_set_id?: string | null
          resource_id?: string
          resource_type?: string
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_permissions_permission_set_id_fkey"
            columns: ["permission_set_id"]
            isOneToOne: false
            referencedRelation: "permission_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_permissions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee_id: string | null
          column_values: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          group_id: string | null
          id: string
          metadata: Json | null
          position: number
          project_id: string | null
          search_text: unknown | null
          status_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assignee_id?: string | null
          column_values?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          group_id?: string | null
          id?: string
          metadata?: Json | null
          position: number
          project_id?: string | null
          search_text?: unknown | null
          status_id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assignee_id?: string | null
          column_values?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          group_id?: string | null
          id?: string
          metadata?: Json | null
          position?: number
          project_id?: string | null
          search_text?: unknown | null
          status_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_invites: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          role: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspace_invites_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          joined_at: string | null
          permissions: Json | null
          role: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          joined_at?: string | null
          permissions?: Json | null
          role: string
          user_id: string
          workspace_id: string
        }
        Update: {
          joined_at?: string | null
          permissions?: Json | null
          role?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          branding: Json | null
          created_at: string | null
          features: Json | null
          id: string
          limits: Json | null
          name: string
          settings: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          branding?: Json | null
          created_at?: string | null
          features?: Json | null
          id?: string
          limits?: Json | null
          name: string
          settings?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          branding?: Json | null
          created_at?: string | null
          features?: Json | null
          id?: string
          limits?: Json | null
          name?: string
          settings?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_project: {
        Args: {
          project_id: string
          user_id?: string
        }
        Returns: boolean
      }
      check_due_date_automations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_rls_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          schema_name: string
          table_name: string
          rls_enabled: boolean
        }[]
      }
      check_table_policies: {
        Args: Record<PropertyKey, never>
        Returns: {
          schema_name: string
          table_name: string
          policy_count: number
        }[]
      }
      get_user_workspace_role: {
        Args: {
          workspace_id: string
          user_id?: string
        }
        Returns: string
      }
      get_workspace_member_count: {
        Args: {
          workspace_id: string
        }
        Returns: number
      }
      is_workspace_member: {
        Args: {
          workspace_id: string
          user_id?: string
        }
        Returns: boolean
      }
      log_feature_usage: {
        Args: {
          feature_name: string
          action: string
          workspace_id?: string
          metadata?: Json
        }
        Returns: string
      }
      log_page_view: {
        Args: {
          path: string
          workspace_id?: string
          referrer?: string
          user_agent?: string
          session_id?: string
        }
        Returns: string
      }
      log_performance_metric: {
        Args: {
          metric_name: string
          value: number
          workspace_id?: string
          metadata?: Json
        }
        Returns: string
      }
      maintenance_vacuum_analyze: {
        Args: {
          tables: string[]
        }
        Returns: undefined
      }
      mark_notifications_read: {
        Args: {
          p_notification_ids: string[]
        }
        Returns: string[]
      }
      move_task: {
        Args: {
          task_id: string
          new_group_id: string
          new_position: number
          user_id?: string
        }
        Returns: undefined
      }
      search_comments: {
        Args: {
          search_query: string
          project_id?: string
        }
        Returns: {
          comment_id: string
          content: string
          task_id: string
          rank: number
        }[]
      }
      search_tasks: {
        Args: {
          search_query: string
          project_id?: string
        }
        Returns: {
          task_id: string
          title: string
          description: string
          rank: number
        }[]
      }
      send_notification: {
        Args: {
          p_user_id: string
          p_workspace_id: string
          p_project_id: string
          p_type: string
          p_title: string
          p_content?: string
          p_link?: string
          p_metadata?: Json
        }
        Returns: string
      }
      unaccent: {
        Args: {
          "": string
        }
        Returns: string
      }
      unaccent_init: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
    }
    Enums: {
      automation_action_type:
        | "assign_task"
        | "update_status"
        | "add_comment"
        | "send_notification"
      automation_trigger_type:
        | "task_created"
        | "task_updated"
        | "task_status_changed"
        | "task_assigned"
        | "comment_added"
        | "due_date_approaching"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
