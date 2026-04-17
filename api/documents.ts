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
        .from('documents')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('last_modified', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { workspace_id, name, type, content, labels, creator_name, creator_type, source, size } = req.body;
      const { data, error } = await supabase
        .from('documents')
        .insert({
          workspace_id: workspace_id || 'w1',
          name,
          type: type || 'Markdown',
          content: content || '',
          labels: labels || '{}',
          creator_name,
          creator_type: creator_type || 'human',
          source: source || 'normal',
          size: size || 0,
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, name, content, labels, is_read, last_viewed } = req.body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const updates: Record<string, any> = { last_modified: new Date().toISOString() };
      if (name !== undefined) updates.name = name;
      if (content !== undefined) updates.content = content;
      if (labels !== undefined) updates.labels = labels;
      if (is_read !== undefined) updates.is_read = is_read;
      if (last_viewed !== undefined) updates.last_viewed = last_viewed;
      const { data, error } = await supabase
        .from('documents')
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
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) throw error;
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('[API /documents]', error);
    return res.status(500).json({ error: error.message });
  }
}
