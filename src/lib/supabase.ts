
import { createClient } from '@supabase/supabase-js';

// Using direct values since environment variables aren't properly configured
const supabaseUrl = 'https://ctuosmgmdhfpkpsojgbe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0dW9zbWdtZGhmcGtwc29qZ2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MTcwNjgsImV4cCI6MjA2MzQ5MzA2OH0.EKAXSaOXJRVqAFyeKxNdTsPVgK8T8LQYq4gpDScgN30';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
