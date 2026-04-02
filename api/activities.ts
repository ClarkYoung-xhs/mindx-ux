import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const workspaceId = (req.query.workspace_id as string) || 'w1';
      const { rows } = await sql`
        SELECT * FROM activities
        WHERE workspace_id = ${workspaceId}
        ORDER BY created_at DESC
        LIMIT 100
      `;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { workspace_id, user_id, user_name, user_type, action, action_zh, target_name, target_type, doc_id, details, details_zh } = req.body;
      const { rows } = await sql`
        INSERT INTO activities (workspace_id, user_id, user_name, user_type, action, action_zh, target_name, target_type, doc_id, details, details_zh)
        VALUES (${workspace_id || 'w1'}, ${user_id}, ${user_name}, ${user_type || 'human'}, ${action}, ${action_zh || null}, ${target_name}, ${target_type}, ${doc_id || null}, ${details || null}, ${details_zh || null})
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('[API /activities]', error);
    return res.status(500).json({ error: error.message });
  }
}
