import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');
import type { IncomingMessage, ServerResponse } from 'http';

type Req = IncomingMessage & { method?: string; query: Record<string, string | string[]>; body: any };
type Res = ServerResponse & { status: (code: number) => Res; json: (data: any) => void; end: () => void };

const EMPTY_SEED = (workspaceId: string) => ({
  workspace_id: workspaceId,
  professional_role: '',
  current_focus: '',
  recent_context: '',
  core_boundary: '',
});

export default async function handler(req: Req, res: Res) {
  try {
    const workspaceId = ((req.query.workspace_id as string) || req.body?.workspace_id || 'w1');

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('profile_identity')
        .select('*')
        .eq('workspace_id', workspaceId)
        .single();

      if (error && error.code === 'PGRST116') {
        return res.status(200).json(EMPTY_SEED(workspaceId));
      }
      if (error) throw error;

      // Backward-compat: if old row has current_goal but not current_focus, migrate on read
      const row = data as any;
      if (!row.current_focus && row.current_goal) {
        row.current_focus = row.current_goal;
      }
      return res.status(200).json(row);
    }

    if (req.method === 'PUT') {
      const { professional_role, current_focus, recent_context, core_boundary } = req.body;
      const { data, error } = await supabase
        .from('profile_identity')
        .upsert({
          workspace_id: workspaceId,
          professional_role: professional_role ?? '',
          current_focus:     current_focus     ?? '',
          recent_context:    recent_context    ?? '',
          core_boundary:     core_boundary     ?? '',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'workspace_id' })
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('[API /profile]', error);
    return res.status(500).json({ error: error.message });
  }
}
