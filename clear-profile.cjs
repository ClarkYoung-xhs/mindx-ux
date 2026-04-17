require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
async function run() {
  const { error } = await supabase.from('user_profile').delete().neq('key', 'nonsense');
  if (error) console.error(error);
  else console.log("Profile cleared.");
}
run();
