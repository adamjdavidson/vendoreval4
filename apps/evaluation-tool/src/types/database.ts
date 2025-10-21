export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          is_super_admin: boolean
          revoked_at: string | null
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_super_admin?: boolean
          revoked_at?: string | null
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_super_admin?: boolean
          revoked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string
          created_at: string
          id: string
          key: string
          order_index: number
          subtitle_corporate: string
          subtitle_no_bs: string
          title_corporate: string
          title_no_bs: string
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          key: string
          order_index: number
          subtitle_corporate: string
          subtitle_no_bs: string
          title_corporate: string
          title_no_bs: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          key?: string
          order_index?: number
          subtitle_corporate?: string
          subtitle_no_bs?: string
          title_corporate?: string
          title_no_bs?: string
          updated_at?: string
        }
        Relationships: []
      }
      evaluations: {
        Row: {
          answers: Json
          completed_question_count: number
          completion_percentage: number
          created_at: string
          id: string
          updated_at: string
          user_id: string | null
          vendor_name: string
        }
        Insert: {
          answers?: Json
          completed_question_count?: number
          completion_percentage?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
          vendor_name: string
        }
        Update: {
          answers?: Json
          completed_question_count?: number
          completion_percentage?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          admin_notes: string | null
          created_at: string
          github_issue_number: number | null
          github_issue_url: string | null
          github_status: string | null
          id: string
          message: string
          page_url: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          github_issue_number?: number | null
          github_issue_url?: string | null
          github_status?: string | null
          id?: string
          message: string
          page_url: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          github_issue_number?: number | null
          github_issue_url?: string | null
          github_status?: string | null
          id?: string
          message?: string
          page_url?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invite_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string
          email: string | null
          expires_at: string
          id: string
          is_active: boolean
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by: string
          email?: string | null
          expires_at: string
          id?: string
          is_active?: boolean
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          email?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invite_codes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invite_codes_used_by_fkey"
            columns: ["used_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          category_id: string
          created_at: string
          help_text_corporate: string | null
          help_text_no_bs: string | null
          id: string
          is_critical: boolean
          order_index: number
          text_corporate: string
          text_no_bs: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          help_text_corporate?: string | null
          help_text_no_bs?: string | null
          id?: string
          is_critical?: boolean
          order_index: number
          text_corporate: string
          text_no_bs: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          help_text_corporate?: string | null
          help_text_no_bs?: string | null
          id?: string
          is_critical?: boolean
          order_index?: number
          text_corporate?: string
          text_no_bs?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          discord_id: string | null
          discord_username: string | null
          display_name: string | null
          email: string
          id: string
          is_active: boolean
          last_membership_check: string | null
          login_count: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          discord_id?: string | null
          discord_username?: string | null
          display_name?: string | null
          email: string
          id?: string
          is_active?: boolean
          last_membership_check?: string | null
          login_count?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          discord_id?: string | null
          discord_username?: string | null
          display_name?: string | null
          email?: string
          id?: string
          is_active?: boolean
          last_membership_check?: string | null
          login_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      vendor_evaluations: {
        Row: {
          answer: string
          created_at: string
          evidence_corporate: string | null
          evidence_no_bs: string | null
          id: string
          question_id: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          evidence_corporate?: string | null
          evidence_no_bs?: string | null
          id?: string
          question_id: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          evidence_corporate?: string | null
          evidence_no_bs?: string | null
          id?: string
          question_id?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_evaluations_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_evaluations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          created_at: string
          description_corporate: string | null
          description_no_bs: string | null
          id: string
          is_official: boolean
          last_refreshed_at: string | null
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description_corporate?: string | null
          description_no_bs?: string | null
          id?: string
          is_official?: boolean
          last_refreshed_at?: string | null
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description_corporate?: string | null
          description_no_bs?: string | null
          id?: string
          is_official?: boolean
          last_refreshed_at?: string | null
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

