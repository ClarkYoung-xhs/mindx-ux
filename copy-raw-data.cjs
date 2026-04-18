const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function copyRawData() {
  const { data: oldData, error } = await supabase.from('rawdata').select('*').eq('workspace_id', 'w1');
  if (error) {
    console.error("Fetch error:", error);
    return;
  }
  
  if (!oldData || oldData.length === 0) {
    console.log("No data found in workspace 'w1'");
    return;
  }
  
  console.log(`Found ${oldData.length} records in 'w1'`);
  const targetWorkspace = 'w-clark2020-qq-com';
  
  const newData = oldData.map((d, index) => ({
    id: `raw-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
    workspace_id: targetWorkspace,
    name: d.name,
    type: d.type,
    size: d.size,
    source: d.source,
    content: d.content,
    created_at: d.created_at
  }));
  
  const { error: insertError } = await supabase.from('rawdata').insert(newData);
  if (insertError) {
    console.error("Failed to insert", insertError);
  } else {
    console.log(`Successfully copied ${newData.length} rows to workspace ${targetWorkspace}!`);
  }
}
copyRawData();
