// supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://feprrvwzdivvwmyuiwbi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_OYSlrVtAAl74kxc8mOC2Ew_s4WGXy2z';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);