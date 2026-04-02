import { sql } from '@vercel/postgres';
import type { IncomingMessage, ServerResponse } from 'http';

type Req = IncomingMessage & { method?: string; query: Record<string, string | string[]>; body: any };
type Res = ServerResponse & { status: (code: number) => Res; json: (data: any) => void; end: () => void };

export default async function handler(req: Req, res: Res) {
  try {
    // Auto-create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS rawdata (
        id TEXT PRIMARY KEY,
        workspace_id TEXT NOT NULL DEFAULT 'w1',
        name TEXT NOT NULL,
        type TEXT DEFAULT 'TXT',
        size INTEGER DEFAULT 0,
        source TEXT DEFAULT 'paste',
        content TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    if (req.method === 'GET') {
      const workspaceId = (req.query.workspace_id as string) || 'w1';
      const { rows } = await sql`
        SELECT * FROM rawdata
        WHERE workspace_id = ${workspaceId}
        ORDER BY created_at DESC
      `;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { workspace_id, id, name, type, size, source, content } = req.body;
      if (!name) return res.status(400).json({ error: 'name is required' });
      const rdId = id || `raw-${Date.now()}`;
      const { rows } = await sql`
        INSERT INTO rawdata (id, workspace_id, name, type, size, source, content)
        VALUES (${rdId}, ${workspace_id || 'w1'}, ${name}, ${type || 'TXT'}, ${size || 0}, ${source || 'paste'}, ${content || ''})
        ON CONFLICT (id) DO UPDATE SET name = ${name}, content = ${content || ''}, type = ${type || 'TXT'}, size = ${size || 0}
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
      const { id, name, content } = req.body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { rows } = await sql`
        UPDATE rawdata SET
          name = COALESCE(${name}, name),
          content = COALESCE(${content}, content)
        WHERE id = ${id}
        RETURNING *
      `;
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'id is required' });
      await sql`DELETE FROM rawdata WHERE id = ${id}`;
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('[API /rawdata]', error);
    return res.status(500).json({ error: error.message });
  }
}
