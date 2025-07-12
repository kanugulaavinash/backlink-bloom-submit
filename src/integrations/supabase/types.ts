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
      api_keys: {
        Row: {
          created_at: string | null
          id: string
          is_configured: boolean | null
          key_name: string
          key_value: string
          service_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_configured?: boolean | null
          key_name: string
          key_value: string
          service_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_configured?: boolean | null
          key_name?: string
          key_value?: string
          service_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      guest_posts: {
        Row: {
          author_bio: string | null
          author_name: string
          author_website: string | null
          category: string
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          published_at: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          author_bio?: string | null
          author_name: string
          author_website?: string | null
          category: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          author_bio?: string | null
          author_name?: string
          author_website?: string | null
          category?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
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
      get_user_role: {
        Args: { _user_id: string }
        Returns: string
      }
      has_role: {
        Args: { _user_id: string; _role: string }
        Returns: boolean
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
