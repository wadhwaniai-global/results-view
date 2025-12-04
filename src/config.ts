// config.ts - Supabase Configuration
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
    url: string;
    anonKey: string;
}

const SUPABASE_CONFIG: SupabaseConfig = {
    url: 'https://btqomgyzueuivyctkyyw.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cW9tZ3l6dWV1aXZ5Y3RreXl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwODA3MTgsImV4cCI6MjA3ODY1NjcxOH0.iwOkX7uLue3F-WN8AztMFRBjV5YCnB817Dn82RmiR0E'
};

// Initialize Supabase client
export const supabaseClient: SupabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

export default SUPABASE_CONFIG;


