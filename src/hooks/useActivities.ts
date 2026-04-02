import { useState, useEffect, useCallback } from 'react';

export interface ActivityRow {
  id: string;
  workspace_id: string;
  user_id: string;
  user_name: string;
  user_type: 'human' | 'agent';
  action: string;
  action_zh: string | null;
  target_name: string;
  target_type: string;
  doc_id: string | null;
  details: string | null;
  details_zh: string | null;
  created_at: string;
}

const toActivity = (row: ActivityRow) => ({
  id: row.id,
  workspaceId: row.workspace_id,
  userId: row.user_id,
  userName: row.user_name,
  userType: row.user_type,
  action: row.action,
  actionZh: row.action_zh || row.action,
  targetName: row.target_name,
  targetType: row.target_type,
  docId: row.doc_id || undefined,
  details: row.details || undefined,
  detailsZh: row.details_zh || undefined,
  timestamp: row.created_at,
});

const API_BASE = '/api/activities';

export function useActivities(workspaceId: string, fallbackActivities: any[]) {
  const [activities, setActivities] = useState<any[]>(fallbackActivities);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}?workspace_id=${workspaceId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ActivityRow[] = await res.json();
      if (data && data.length > 0) {
        setActivities(data.map(toActivity));
      }
    } catch (e: any) {
      console.warn('[useActivities] API fetch failed, using fallback:', e.message);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const createActivity = useCallback(async (act: Partial<ActivityRow>) => {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: workspaceId,
          user_id: act.user_id || 'u1',
          user_name: act.user_name || 'Me',
          user_type: act.user_type || 'human',
          action: act.action || 'created',
          action_zh: act.action_zh || null,
          target_name: act.target_name || '',
          target_type: act.target_type || '',
          doc_id: act.doc_id || null,
          details: act.details || null,
          details_zh: act.details_zh || null,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const row: ActivityRow = await res.json();
      const newAct = toActivity(row);
      setActivities(prev => [newAct, ...prev]);
      return newAct;
    } catch {
      const localAct = {
        id: crypto.randomUUID(),
        workspaceId,
        userId: act.user_id || 'u1',
        userName: act.user_name || 'Me',
        userType: act.user_type || 'human',
        action: act.action || 'created',
        actionZh: act.action_zh || act.action || '创建了',
        targetName: act.target_name || '',
        targetType: act.target_type || '',
        docId: act.doc_id || undefined,
        details: act.details || undefined,
        detailsZh: act.details_zh || undefined,
        timestamp: new Date().toISOString(),
      };
      setActivities(prev => [localAct, ...prev]);
      return localAct;
    }
  }, [workspaceId]);

  return { activities, setActivities, loading, createActivity };
}
