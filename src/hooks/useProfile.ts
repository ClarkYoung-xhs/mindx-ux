import { useState, useEffect, useCallback, useMemo } from 'react';

const API_BASE = '/api/profile';

export interface ProfileIdentity {
  workspace_id: string;
  professional_role: string;
  current_goal: string;
  core_boundary: string;
  [key: string]: string; // allow future custom fields
}

/**
 * Metadata for each profile_identity field — drives the dynamic seed card UI.
 * Adding a new field here + to the DB schema is all you need to get a new card.
 */
export interface SeedCardMeta {
  field: string;          // DB column name
  label: string;          // Chinese card title
  labelEn: string;        // English subtitle
  eyebrow: string;        // small caps eyebrow label
  profileKey: string;     // key passed to updateProfile / DocumentEditor
  previewType: 'memory' | 'goals';
}

export const SEED_CARD_DEFS: SeedCardMeta[] = [
  {
    field: 'professional_role',
    label: '职业身份',
    labelEn: 'Professional Role',
    eyebrow: 'Role',
    profileKey: 'whoami',
    previewType: 'memory',
  },
  {
    field: 'current_goal',
    label: '当前目标',
    labelEn: 'Current Goal',
    eyebrow: 'Goal',
    profileKey: 'goal',
    previewType: 'goals',
  },
  {
    field: 'core_boundary',
    label: '底线约束',
    labelEn: 'Core Boundary',
    eyebrow: 'Boundary',
    profileKey: 'boundary',
    previewType: 'memory',
  },
];

export interface SeedCard extends SeedCardMeta {
  value: string;
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
    const fieldMap: Record<string, string> = {
      whoami: 'professional_role',
      goal: 'current_goal',
      boundary: 'core_boundary',
      professional_role: 'professional_role',
      current_goal: 'current_goal',
      core_boundary: 'core_boundary',
    };
    const field = fieldMap[key] || key;

    setProfile(prev => ({ ...prev, [field]: value }));
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

  // Derive seed cards dynamically from SEED_CARD_DEFS + live profile data
  const seedCards: SeedCard[] = useMemo(() =>
    SEED_CARD_DEFS.map(def => ({
      ...def,
      value: profile[def.field] || '',
    })),
    [profile]
  );

  // Backward-compat getters
  const compat = {
    ...profile,
    whoami: profile.professional_role,
    goal: profile.current_goal,
  };

  return { profile: compat, seedCards, loading, updateProfile };
}
