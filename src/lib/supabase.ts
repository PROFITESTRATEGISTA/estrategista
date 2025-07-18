import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key'

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables not configured. Using fallback to localStorage for demo.')
}

// Create Supabase client only if properly configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Safe wrapper for Supabase operations
export const safeSupabaseCall = async <T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> => {
  if (!supabase) {
    console.log('Supabase not configured, using fallback')
    return fallback
  }
  
  try {
    return await operation()
  } catch (error) {
    console.warn('Supabase operation failed, using fallback:', error)
    return fallback
  }
}

export default supabase