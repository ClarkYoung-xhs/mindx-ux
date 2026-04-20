import { useState, useEffect, useCallback, useMemo } from 'react';

const API_BASE = '/api/profile';

export interface ProfileIdentity {
  workspace_id: string;
  professional_role: string;   // 稳定 — 角色标签，手动填
  current_focus: string;       // 中频 — 这段时间在关注什么，每周更新
  recent_context: string;      // 高频 — 近期动态，可自动生成
  core_boundary: string;       // 稳定 — 底线约束，手动填
  [key: string]: string;
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
    label: '工作背景',
    labelEn: 'Work Background',
    eyebrow: 'Background',
    profileKey: 'whoami',
    previewType: 'memory',
  },
  {
    field: 'current_focus',
    label: '当前关注',
    labelEn: 'Current Focus',
    eyebrow: 'Focus',
    profileKey: 'focus',
    previewType: 'memory',
  },
  {
    field: 'recent_context',
    label: '近期动态',
    labelEn: 'Recent Activity',
    eyebrow: 'Activity',
    profileKey: 'recent',
    previewType: 'goals',
  },
  {
    field: 'core_boundary',
    label: '个人底线',
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
  current_focus: '',
  recent_context: '',
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
      whoami:            'professional_role',
      focus:             'current_focus',
      recent:            'recent_context',
      boundary:          'core_boundary',
      professional_role: 'professional_role',
      current_focus:     'current_focus',
      recent_context:    'recent_context',
      core_boundary:     'core_boundary',
      // legacy compat
      goal:              'current_focus',
      current_goal:      'current_focus',
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
