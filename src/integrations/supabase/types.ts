export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      api_key_configurations: {
        Row: {
          api_key_id: string | null
          configuration_key: string
          configuration_value: string
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          api_key_id?: string | null
          configuration_key: string
          configuration_value: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          api_key_id?: string | null
          configuration_key?: string
          configuration_value?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_key_configurations_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string | null
          id: string
          integration_status: string | null
          is_configured: boolean | null
          key_name: string
          key_value: string
          last_test_at: string | null
          service_name: string
          service_type: string | null
          test_result: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          integration_status?: string | null
          is_configured?: boolean | null
          key_name: string
          key_value: string
          last_test_at?: string | null
          service_name: string
          service_type?: string | null
          test_result?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          integration_status?: string | null
          is_configured?: boolean | null
          key_name?: string
          key_value?: string
          last_test_at?: string | null
          service_name?: string
          service_type?: string | null
          test_result?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      guest_posts: {
        Row: {
          author_bio: string | null
          author_name: string
          author_website: string | null
          auto_publish: boolean | null
          category: string
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          payment_status: string | null
          published_at: string | null
          scheduled_for: string | null
          status: string
          submission_step: number | null
          tags: string[] | null
          timezone: string | null
          title: string
          updated_at: string | null
          user_id: string
          validation_status: string | null
        }
        Insert: {
          author_bio?: string | null
          author_name: string
          author_website?: string | null
          auto_publish?: boolean | null
          category: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          payment_status?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: string
          submission_step?: number | null
          tags?: string[] | null
          timezone?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          validation_status?: string | null
        }
        Update: {
          author_bio?: string | null
          author_name?: string
          author_website?: string | null
          auto_publish?: boolean | null
          category?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          payment_status?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: string
          submission_step?: number | null
          tags?: string[] | null
          timezone?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          validation_status?: string | null
        }
        Relationships: []
      }
      import_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          errors: Json | null
          failed_imports: number | null
          filename: string
          id: string
          imported_by: string
          status: string | null
          successful_imports: number | null
          total_posts: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          errors?: Json | null
          failed_imports?: number | null
          filename: string
          id?: string
          imported_by: string
          status?: string | null
          successful_imports?: number | null
          total_posts?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          errors?: Json | null
          failed_imports?: number | null
          filename?: string
          id?: string
          imported_by?: string
          status?: string | null
          successful_imports?: number | null
          total_posts?: number | null
        }
        Relationships: []
      }
      imported_posts: {
        Row: {
          categories: string[] | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          import_session_id: string
          imported_by: string
          published_date: string | null
          slug: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          wordpress_id: string | null
          wordpress_url: string | null
        }
        Insert: {
          categories?: string[] | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          import_session_id: string
          imported_by: string
          published_date?: string | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          wordpress_id?: string | null
          wordpress_url?: string | null
        }
        Update: {
          categories?: string[] | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          import_session_id?: string
          imported_by?: string
          published_date?: string | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          wordpress_id?: string | null
          wordpress_url?: string | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          post_id: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          post_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          post_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "guest_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      user_invitations: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invited_by: string | null
          message: string | null
          role: Database["public"]["Enums"]["app_role"]
          status: string | null
          token: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          message?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: string | null
          token?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          message?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: string | null
          token?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      validation_results: {
        Row: {
          ai_content_highlights: Json | null
          ai_content_score: number | null
          ai_detection_details: Json | null
          created_at: string | null
          id: string
          plagiarism_details: Json | null
          plagiarism_highlights: Json | null
          plagiarism_score: number | null
          post_id: string | null
          updated_at: string | null
          validation_status: string | null
        }
        Insert: {
          ai_content_highlights?: Json | null
          ai_content_score?: number | null
          ai_detection_details?: Json | null
          created_at?: string | null
          id?: string
          plagiarism_details?: Json | null
          plagiarism_highlights?: Json | null
          plagiarism_score?: number | null
          post_id?: string | null
          updated_at?: string | null
          validation_status?: string | null
        }
        Update: {
          ai_content_highlights?: Json | null
          ai_content_score?: number | null
          ai_detection_details?: Json | null
          created_at?: string | null
          id?: string
          plagiarism_details?: Json | null
          plagiarism_highlights?: Json | null
          plagiarism_score?: number | null
          post_id?: string | null
          updated_at?: string | null
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "validation_results_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "guest_posts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      custom_create_invitation: {
        Args: {
          p_email: string
          p_role: string
          p_message: string
          p_invited_by: string
        }
        Returns: undefined
      }
      custom_delete_api_key: {
        Args: { p_id: string }
        Returns: undefined
      }
      custom_select: {
        Args: { query: string }
        Returns: {
          result: Json
        }[]
      }
      custom_upsert_api_key: {
        Args: {
          p_service_name: string
          p_key_name: string
          p_key_value: string
        }
        Returns: undefined
      }
      custom_upsert_api_key_with_config: {
        Args: {
          p_service_name: string
          p_key_name: string
          p_key_value: string
          p_service_type?: string
          p_configurations?: Json
        }
        Returns: string
      }
      get_category_usage_count: {
        Args: { category_name: string }
        Returns: number
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: string
      }
      has_role: {
        Args: { _user_id: string; _role: string }
        Returns: boolean
      }
      update_api_key_test_result: {
        Args: { p_id: string; p_status: string; p_result: Json }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
