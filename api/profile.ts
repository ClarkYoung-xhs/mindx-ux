import { supabase } from './_supabase';
import type { IncomingMessage, ServerResponse } from 'http';

type Req = IncomingMessage & { method?: string; query: Record<string, string | string[]>; body: any };
type Res = ServerResponse & { status: (code: number) => Res; json: (data: any) => void; end: () => void };

export default async function handler(req: Req, res: Res) {
  try {
    if (req.method === 'GET') {
      const workspaceId = (req.query.workspace_id as string) || 'w1';
      const { data, error } = await supabase
        .from('user_profile')
        .select('key, value')
        .eq('workspace_id', workspaceId);
      if (error) throw error;
      const result: Record<string, string> = {};
      for (const row of data || []) {
        result[row.key] = row.value;
      }
      return res.status(200).json(result);
    }

    if (req.method === 'PUT') {
      const { workspace_id, key, value } = req.body;
      if (!key) return res.status(400).json({ error: 'key is required' });
      const wid = workspace_id || 'w1';
      const { error } = await supabase
        .from('user_profile')
        .upsert({
          workspace_id: wid,
          key,
          value: value || '',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'workspace_id,key' });
      if (error) throw error;
      return res.status(200).json({ key, value });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('[API /profile]', error);
    return res.status(500).json({ error: error.message });
  }
}
