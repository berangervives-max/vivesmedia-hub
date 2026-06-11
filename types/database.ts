export type ProjectPhase =
  | 'onboarding'
  | 'design'
  | 'dev'
  | 'recette'
  | 'livraison'
  | 'maintenance'

export type FileCategory = 'file' | 'maquette' | 'invoice'

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export type TicketPriority = 'low' | 'medium' | 'high'

export type NotificationType =
  | 'phase_change'
  | 'new_file'
  | 'review_request'
  | 'ticket_reply'

export type FormFieldType = 'text' | 'textarea' | 'select' | 'multiselect' | 'file' | 'url'

export interface FormField {
  id: string
  type: FormFieldType
  label: string
  required: boolean
  options?: string[]
  placeholder?: string
}

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          user_id: string | null
          name: string
          email: string
          company: string | null
          phone: string | null
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          email: string
          company?: string | null
          phone?: string | null
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          email?: string
          company?: string | null
          phone?: string | null
          created_at?: string
          created_by?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          client_id: string
          name: string
          description: string | null
          current_phase: ProjectPhase
          is_maintenance: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          description?: string | null
          current_phase?: ProjectPhase
          is_maintenance?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          name?: string
          description?: string | null
          current_phase?: ProjectPhase
          is_maintenance?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      phase_history: {
        Row: {
          id: string
          project_id: string
          phase: ProjectPhase
          changed_by: string
          note: string | null
          changed_at: string
        }
        Insert: {
          id?: string
          project_id: string
          phase: ProjectPhase
          changed_by: string
          note?: string | null
          changed_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          phase?: ProjectPhase
          changed_by?: string
          note?: string | null
          changed_at?: string
        }
        Relationships: []
      }
      onboarding_forms: {
        Row: {
          id: string
          project_id: string
          title: string
          fields: FormField[]
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          fields?: FormField[]
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          fields?: FormField[]
          created_at?: string
        }
        Relationships: []
      }
      form_responses: {
        Row: {
          id: string
          form_id: string
          client_id: string
          responses: Record<string, string | string[]>
          is_complete: boolean
          submitted_at: string | null
        }
        Insert: {
          id?: string
          form_id: string
          client_id: string
          responses?: Record<string, string | string[]>
          is_complete?: boolean
          submitted_at?: string | null
        }
        Update: {
          id?: string
          form_id?: string
          client_id?: string
          responses?: Record<string, string | string[]>
          is_complete?: boolean
          submitted_at?: string | null
        }
        Relationships: []
      }
      files: {
        Row: {
          id: string
          project_id: string
          name: string
          category: FileCategory
          storage_path: string
          uploaded_by: string
          uploaded_at: string
          size_bytes: number | null
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          category: FileCategory
          storage_path: string
          uploaded_by: string
          uploaded_at?: string
          size_bytes?: number | null
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          category?: FileCategory
          storage_path?: string
          uploaded_by?: string
          uploaded_at?: string
          size_bytes?: number | null
        }
        Relationships: []
      }
      training_videos: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          url: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          url: string
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          url?: string
          position?: number
          created_at?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          id: string
          project_id: string
          client_id: string
          title: string
          description: string
          status: TicketStatus
          priority: TicketPriority
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          client_id: string
          title: string
          description: string
          status?: TicketStatus
          priority?: TicketPriority
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          client_id?: string
          title?: string
          description?: string
          status?: TicketStatus
          priority?: TicketPriority
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          id: string
          ticket_id: string
          author_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          author_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          author_id?: string
          content?: string
          created_at?: string
        }
        Relationships: []
      }
      notifications_log: {
        Row: {
          id: string
          project_id: string
          type: NotificationType
          recipient_email: string
          sent_at: string
          metadata: Record<string, unknown>
        }
        Insert: {
          id?: string
          project_id: string
          type: NotificationType
          recipient_email: string
          sent_at?: string
          metadata?: Record<string, unknown>
        }
        Update: {
          id?: string
          project_id?: string
          type?: NotificationType
          recipient_email?: string
          sent_at?: string
          metadata?: Record<string, unknown>
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
      project_phase: ProjectPhase
      file_category: FileCategory
      ticket_status: TicketStatus
      ticket_priority: TicketPriority
      notification_type: NotificationType
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export const PHASE_LABELS: Record<ProjectPhase, string> = {
  onboarding: 'Onboarding',
  design: 'Design',
  dev: 'Développement',
  recette: 'Recette',
  livraison: 'Livraison',
  maintenance: 'Maintenance',
}

export const PHASE_ORDER: ProjectPhase[] = [
  'onboarding',
  'design',
  'dev',
  'recette',
  'livraison',
  'maintenance',
]

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Ouvert',
  in_progress: 'En cours',
  resolved: 'Résolu',
  closed: 'Fermé',
}

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Faible',
  medium: 'Moyen',
  high: 'Urgent',
}
