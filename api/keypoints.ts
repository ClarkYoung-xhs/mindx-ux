import { supabase } from './_supabase';
import type { IncomingMessage, ServerResponse } from 'http';

type Req = IncomingMessage & { method?: string; query: Record<string, string | string[]>; body: any };
type Res = ServerResponse & { status: (code: number) => Res; json: (data: any) => void; end: () => void };

export default async function handler(req: Req, res: Res) {
  try {
    if (req.method === 'GET') {
      const workspaceId = (req.query.workspace_id as string) || 'w1';
      const { data, error } = await supabase
        .from('keypoints')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { workspace_id, id, title, type, text, source } = req.body;
      if (!title || !text) return res.status(400).json({ error: 'title and text are required' });
      const kpId = id || `kp-${Date.now()}`;
      const { data, error } = await supabase
        .from('keypoints')
        .upsert({
          id: kpId,
          workspace_id: workspace_id || 'w1',
          title,
          type: type || 'insight',
          text,
          source: source || '',
        }, { onConflict: 'id' })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('keypoints').delete().eq('id', id);
      if (error) throw error;
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('[API /keypoints]', error);
    return res.status(500).json({ error: error.message });
  }
}
