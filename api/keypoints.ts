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
        .from('keypoints')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });
      if (error) throw error;

      // Handle JSON deserialization fallback for new struct
      const mappedData = data.map((item: any) => {
        let textBody = item.text;
        let context = '';
        let original_quote = '';
        try {
          const parsed = JSON.parse(item.text);
          if (parsed && typeof parsed === 'object' && parsed._isProfileSignal) {
            textBody = parsed.text || '';
            context = parsed.context || '';
            original_quote = parsed.original_quote || '';
          }
        } catch {
          // backward compatibility: use raw string if not JSON
        }
        return { ...item, text: textBody, context, original_quote };
      });

      return res.status(200).json(mappedData);
    }

    if (req.method === 'POST') {
      const { workspace_id, id, title, type, text, source, context, original_quote } = req.body;
      if (!title || !text) return res.status(400).json({ error: 'title and text are required' });
      const kpId = id || `kp-${Date.now()}`;

      // Handle JSON serialization fallback
      const serializedText = JSON.stringify({
        _isProfileSignal: true,
        text,
        context: context || '',
        original_quote: original_quote || ''
      });

      const { data, error } = await supabase
        .from('keypoints')
        .upsert({
          id: kpId,
          workspace_id: workspace_id || 'w1',
          title,
          type: type || 'insight',
          text: serializedText,
          source: source || ''
        }, { onConflict: 'id' })
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
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
