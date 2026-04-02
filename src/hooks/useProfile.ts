import { useState, useEffect, useCallback } from 'react';

const API_BASE = '/api/profile';

export function useProfile(workspaceId: string) {
  const [profile, setProfile] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}?workspace_id=${workspaceId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data && Object.keys(data).length > 0) {
        setProfile(data);
        // Sync to localStorage for extraction engine compatibility
        if (data.whoami) localStorage.setItem('mindx_raw_whoami_doc', data.whoami);
        if (data.goal) localStorage.setItem('mindx_raw_goal_doc', data.goal);
      }
    } catch (e: any) {
      console.warn('[useProfile] API fetch failed, using localStorage:', e.message);
      // Fallback: read from localStorage
      setProfile({
        whoami: localStorage.getItem('mindx_raw_whoami_doc') || '',
        goal: localStorage.getItem('mindx_raw_goal_doc') || '',
      });
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (key: string, value: string) => {
    // Optimistic update
    setProfile(prev => ({ ...prev, [key]: value }));
    // Also sync to localStorage for extraction engine
    if (key === 'whoami') localStorage.setItem('mindx_raw_whoami_doc', value);
    if (key === 'goal') localStorage.setItem('mindx_raw_goal_doc', value);

    try {
      const res = await fetch(API_BASE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspace_id: workspaceId, key, value }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e: any) {
      console.warn('[useProfile] API save failed, kept in localStorage:', e.message);
    }
  }, [workspaceId]);

  return { profile, loading, updateProfile };
}
