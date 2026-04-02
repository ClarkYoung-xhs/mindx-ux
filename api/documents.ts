import { sql } from '@vercel/postgres';
import type { IncomingMessage, ServerResponse } from 'http';

type Req = IncomingMessage & { method?: string; query: Record<string, string | string[]>; body: any };
type Res = ServerResponse & { status: (code: number) => Res; json: (data: any) => void; end: () => void };

export default async function handler(req: Req, res: Res) {
  try {
    if (req.method === 'GET') {
      const workspaceId = (req.query.workspace_id as string) || 'w1';
      const { rows } = await sql`
        SELECT * FROM documents 
        WHERE workspace_id = ${workspaceId}
        ORDER BY last_modified DESC
      `;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { workspace_id, name, type, content, labels, creator_name, creator_type, source, size } = req.body;
      const { rows } = await sql`
        INSERT INTO documents (workspace_id, name, type, content, labels, creator_name, creator_type, source, size)
        VALUES (${workspace_id || 'w1'}, ${name}, ${type || 'Markdown'}, ${content || ''}, ${labels || '{}'}, ${creator_name}, ${creator_type || 'human'}, ${source || 'normal'}, ${size || 0})
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
      const { id, name, content, labels, is_read, last_viewed } = req.body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { rows } = await sql`
        UPDATE documents SET
          name = COALESCE(${name}, name),
          content = COALESCE(${content}, content),
          labels = COALESCE(${labels}, labels),
          is_read = COALESCE(${is_read}, is_read),
          last_viewed = COALESCE(${last_viewed}, last_viewed),
          last_modified = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'id is required' });
      await sql`DELETE FROM documents WHERE id = ${id}`;
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('[API /documents]', error);
    return res.status(500).json({ error: error.message });
  }
}
