import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cpwebsttevjbbewdnauh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwd2Vic3R0ZXZqYmJld2RuYXVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTgzNjc1NCwiZXhwIjoyMDY1NDEyNzU0fQ.YDk7LWx392w7USALRuTkkov1UHMBA5c_R8vz4VErxaw';
 
export const supabase = createClient(supabaseUrl, supabaseKey); 