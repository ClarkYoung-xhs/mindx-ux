require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
async function run() {
  const { data } = await supabase.from('rawdata').select('*');
  console.log("Total rawdata:", data?.length);
  const emptyContents = data?.filter(d => !d.content || d.content.trim() === '');
  console.log("Empty contents count:", emptyContents?.length);
  if(data?.length > 0) {
    console.log("Samples:", data.slice(0,3).map(d => ({name: d.name, size: d.size, id: d.id, created: d.created_at})));
  }
}
run();
