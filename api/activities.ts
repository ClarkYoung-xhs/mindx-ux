import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');
import type { IncomingMessage, ServerResponse } from 'http';

type Req = IncomingMessage & { method?: string; query: Record<string, string | string[]>; body: any };
type Res = ServerResponse & { status: (code: number) => Res; json: (data: any) => void; end: () => void };

export default async function handler(req: Req, res: Res) {
  try {
    if (req.method === 'GET') {
      const workspaceId = (req.query.workspace_id as string) || 'w1';
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { workspace_id, user_id, user_name, user_type, action, action_zh, target_name, target_type, doc_id, details, details_zh } = req.body;
      const { data, error } = await supabase
        .from('activities')
        .insert({
          workspace_id: workspace_id || 'w1',
          user_id,
          user_name,
          user_type: user_type || 'human',
          action,
          action_zh: action_zh || null,
          target_name,
          target_type,
          doc_id: doc_id || null,
          details: details || null,
          details_zh: details_zh || null,
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('[API /activities]', error);
    return res.status(500).json({ error: error.message });
  }
}
