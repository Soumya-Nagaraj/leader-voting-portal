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
      nominees: {
        Row: {
          id: string
          displayname: string
          department: string | null
          location: string | null
          votes: number
          created_at: string
          approved: boolean
          imageurl: string | null
        }
        Insert: {
          id?: string
          displayname: string
          department?: string | null
          location?: string | null
          votes?: number
          created_at?: string
          approved?: boolean
          imageurl?: string | null
        }
        Update: {
          id?: string
          displayname?: string
          department?: string | null
          location?: string | null
          votes?: number
          created_at?: string
          approved?: boolean
          imageurl?: string | null
        }
      }
      votes: {
        Row: {
          id: string
          user_id: string
          nominee_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nominee_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nominee_id?: string
          created_at?: string
        }
      }
    }
  }
}