import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gmewmtsaurzmjcsftihe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtZXdtdHNhdXJ6bWpjc2Z0aWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDMwOTYsImV4cCI6MjA3MzAxOTA5Nn0._jkbxyaAuoYRIYv-qgJuOzoZJQqnia14epiHIxBmy7U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);