import { sql } from '@vercel/postgres';
import type { IncomingMessage, ServerResponse } from 'http';

type Req = IncomingMessage & { method?: string; query: Record<string, string | string[]>; body: any };
type Res = ServerResponse & { status: (code: number) => Res; json: (data: any) => void; end: () => void };

export default async function handler(req: Req, res: Res) {
  try {
    // Auto-create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS keypoints (
        id TEXT PRIMARY KEY,
        workspace_id TEXT NOT NULL DEFAULT 'w1',
        title TEXT NOT NULL,
        type TEXT DEFAULT 'insight',
        text TEXT NOT NULL,
        source TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    if (req.method === 'GET') {
      const workspaceId = (req.query.workspace_id as string) || 'w1';
      const { rows } = await sql`
        SELECT * FROM keypoints
        WHERE workspace_id = ${workspaceId}
        ORDER BY created_at DESC
      `;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { workspace_id, id, title, type, text, source } = req.body;
      if (!title || !text) return res.status(400).json({ error: 'title and text are required' });
      const kpId = id || `kp-${Date.now()}`;
      const { rows } = await sql`
        INSERT INTO keypoints (id, workspace_id, title, type, text, source)
        VALUES (${kpId}, ${workspace_id || 'w1'}, ${title}, ${type || 'insight'}, ${text}, ${source || ''})
        ON CONFLICT (id) DO UPDATE SET title = ${title}, text = ${text}, type = ${type || 'insight'}, source = ${source || ''}
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'id is required' });
      await sql`DELETE FROM keypoints WHERE id = ${id}`;
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('[API /keypoints]', error);
    return res.status(500).json({ error: error.message });
  }
}
