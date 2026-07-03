import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oqbnreihornyhjmsjage.supabase.co';
const supabaseAnonKey = 'sb_publishable_JI_9EToDrNB6KEeKblifmA_aJnJCTrz';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
