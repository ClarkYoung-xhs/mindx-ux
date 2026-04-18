const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function cleanWorkspace() {
  const targetWorkspace = 'w-clark2020-qq-com';

  console.log(`Cleaning workspace: ${targetWorkspace}...`);

  // Delete everything EXCEPT rawdata (since the user specifically asked to copy rawdata over)
  
  // 1. Delete agents
  let res = await supabase.from('agents').delete().eq('workspace_id', targetWorkspace);
  console.log('Deleted agents:', res.error ? res.error : 'Success');

  // 2. Delete memory_nodes
  res = await supabase.from('memory_nodes').delete().eq('workspace_id', targetWorkspace);
  console.log('Deleted memory_nodes:', res.error ? res.error : 'Success');

  // 3. Delete keypoints
  res = await supabase.from('keypoints').delete().eq('workspace_id', targetWorkspace);
  console.log('Deleted keypoints:', res.error ? res.error : 'Success');

  // 4. Delete user_profile
  res = await supabase.from('user_profile').delete().eq('workspace_id', targetWorkspace);
  console.log('Deleted user_profile:', res.error ? res.error : 'Success');
  
  // 5. Delete activities
  res = await supabase.from('activities').delete().eq('workspace_id', targetWorkspace);
  console.log('Deleted activities:', res.error ? res.error : 'Success');

  console.log('Cleanup complete!');
}

cleanWorkspace();
