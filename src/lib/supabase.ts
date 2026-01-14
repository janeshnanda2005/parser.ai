import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qnaspllidbpsnfntoisx.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_pxsjFwmJQQh6ff5loxy8dw_RDGLmrbn'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
