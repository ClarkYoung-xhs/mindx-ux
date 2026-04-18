import { useState, useEffect, useCallback } from 'react';

const API_BASE = '/api/profile';

export interface ProfileIdentity {
  workspace_id: string;
  professional_role: string;
  current_goal: string;
  core_boundary: string;
}

const EMPTY_PROFILE: ProfileIdentity = {
  workspace_id: 'w1',
  professional_role: '',
  current_goal: '',
  core_boundary: '',
};

export function useProfile(workspaceId: string) {
  const [profile, setProfile] = useState<ProfileIdentity>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}?workspace_id=${workspaceId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ProfileIdentity = await res.json();
      setProfile(data);
      // Sync to localStorage for extraction engine / DocumentEditor compatibility
      localStorage.setItem('mindx_raw_whoami_doc', data.professional_role || '');
      localStorage.setItem('mindx_raw_goal_doc', data.current_goal || '');
    } catch (e: any) {
      console.warn('[useProfile] API fetch failed, using localStorage:', e.message);
      setProfile({
        ...EMPTY_PROFILE,
        workspace_id: workspaceId,
        professional_role: localStorage.getItem('mindx_raw_whoami_doc') || '',
        current_goal: localStorage.getItem('mindx_raw_goal_doc') || '',
      });
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (key: string, value: string) => {
    // Map old keys to new fields for backward-compat callers
    const fieldMap: Record<string, keyof ProfileIdentity> = {
      whoami: 'professional_role',
      goal: 'current_goal',
      boundary: 'core_boundary',
      professional_role: 'professional_role',
      current_goal: 'current_goal',
      core_boundary: 'core_boundary',
    };
    const field = fieldMap[key] || key;

    // Optimistic update
    setProfile(prev => ({ ...prev, [field]: value }));
    // Sync to localStorage
    if (field === 'professional_role') localStorage.setItem('mindx_raw_whoami_doc', value);
    if (field === 'current_goal') localStorage.setItem('mindx_raw_goal_doc', value);

    try {
      const res = await fetch(API_BASE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: workspaceId,
          ...profile,
          [field]: value,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e: any) {
      console.warn('[useProfile] API save failed:', e.message);
    }
  }, [workspaceId, profile]);

  // Backward-compat: expose .whoami / .goal getters so old code continues to work
  const compat = {
    ...profile,
    whoami: profile.professional_role,
    goal: profile.current_goal,
  };

  return { profile: compat, loading, updateProfile };
}
