import { sql } from '@vercel/postgres';
import type { IncomingMessage, ServerResponse } from 'http';

type Req = IncomingMessage & { method?: string; query: Record<string, string | string[]>; body: any };
type Res = ServerResponse & { status: (code: number) => Res; json: (data: any) => void; end: () => void };

export default async function handler(req: Req, res: Res) {
  try {
    if (req.method === 'GET') {
      const workspaceId = (req.query.workspace_id as string) || 'w1';
      const { rows } = await sql`
        SELECT key, value FROM user_profile
        WHERE workspace_id = ${workspaceId}
      `;
      // Return as { whoami: "...", goal: "...", ... }
      const result: Record<string, string> = {};
      for (const row of rows) {
        result[row.key] = row.value;
      }
      return res.status(200).json(result);
    }

    if (req.method === 'PUT') {
      const { workspace_id, key, value } = req.body;
      if (!key) return res.status(400).json({ error: 'key is required' });
      const wid = workspace_id || 'w1';
      // Upsert
      await sql`
        INSERT INTO user_profile (workspace_id, key, value)
        VALUES (${wid}, ${key}, ${value || ''})
        ON CONFLICT (workspace_id, key) DO UPDATE SET value = ${value || ''}, updated_at = NOW()
      `;
      return res.status(200).json({ key, value });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('[API /profile]', error);
    return res.status(500).json({ error: error.message });
  }
}
