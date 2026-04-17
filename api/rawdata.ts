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
        .from('rawdata')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { workspace_id, id, name, type, size, source, content } = req.body;
      if (!name) return res.status(400).json({ error: 'name is required' });
      const rdId = id || `raw-${Date.now()}`;
      const { data, error } = await supabase
        .from('rawdata')
        .upsert({
          id: rdId,
          workspace_id: workspace_id || 'w1',
          name,
          type: type || 'TXT',
          size: size || 0,
          source: source || 'paste',
          content: content || '',
        }, { onConflict: 'id' })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, name, content } = req.body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const updates: Record<string, any> = {};
      if (name !== undefined) updates.name = name;
      if (content !== undefined) updates.content = content;
      const { data, error } = await supabase
        .from('rawdata')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('rawdata').delete().eq('id', id);
      if (error) throw error;
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('[API /rawdata]', error);
    return res.status(500).json({ error: error.message });
  }
}
