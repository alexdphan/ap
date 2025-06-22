import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Comment {
  id: number
  video_index: number
  time_seconds: number
  text: string
  author?: string
  created_at: string
}

export interface CommentInsert {
  video_index: number
  time_seconds: number
  text: string
  author?: string
} 