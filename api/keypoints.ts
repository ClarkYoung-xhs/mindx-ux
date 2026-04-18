import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');
import type { IncomingMessage, ServerResponse } from 'http';

type Req = IncomingMessage & { method?: string; query: Record<string, string | string[]>; body: any };
type Res = ServerResponse & { status: (code: number) => Res; json: (data: any) => void; end: () => void };

export default async function handler(req: Req, res: Res) {
  try {
    if (req.method === 'GET') {
      const workspaceId = (req.query.workspace_id as string) || 'w1';
      const dimension = req.query.dimension as string | undefined;

      let query = supabase
        .from('profile_signals')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (dimension) {
        query = query.eq('dimension', dimension);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Backward-compat mapping: expose `type` alias for `dimension`, `text` for `summary`, `title` for `source_doc_name`
      const mapped = (data || []).map((row: any) => ({
        ...row,
        type: row.dimension?.toLowerCase(),
        text: row.summary,
        title: row.source_doc_name || '',
        source: row.source_doc_name || '',
        context: row.context || '',
        original_quote: row.original_quote || '',
      }));

      return res.status(200).json(mapped);
    }

    if (req.method === 'POST') {
      const {
        workspace_id, id, dimension, summary, context, original_quote,
        source_doc_id, source_doc_name, confidence, weight,
        // Backward-compat aliases
        type, text, title, source,
      } = req.body;

      const signalDimension = dimension || (type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Judgment');
      const signalSummary = summary || text;
      if (!signalSummary) return res.status(400).json({ error: 'summary (or text) is required' });

      const signalId = id || `sig-${Date.now()}`;

      const { data, error } = await supabase
        .from('profile_signals')
        .upsert({
          id: signalId,
          workspace_id: workspace_id || 'w1',
          dimension: signalDimension,
          summary: signalSummary,
          context: context || '',
          original_quote: original_quote || '',
          source_doc_id: source_doc_id || '',
          source_doc_name: source_doc_name || title || source || '',
          confidence: confidence ?? 1.0,
          weight: weight ?? 1,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('profile_signals').delete().eq('id', id);
      if (error) throw error;
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('[API /keypoints → profile_signals]', error);
    return res.status(500).json({ error: error.message });
  }
}
