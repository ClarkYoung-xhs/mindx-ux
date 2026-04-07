import { useState, useEffect, useCallback } from 'react';

export interface DocRow {
  id: string;
  workspace_id: string;
  name: string;
  type: string;
  content: string | null;
  labels: string[];
  creator_name: string;
  creator_type: 'human' | 'agent';
  source: 'normal' | 'scheduled' | 'webclip' | 'memory';
  size: number;
  is_read: boolean;
  created_at: string;
  last_modified: string;
  last_viewed: string;
}

// Map DB row → frontend WorkspaceDoc shape
const toWorkspaceDoc = (row: DocRow) => ({
  id: row.id,
  workspaceId: row.workspace_id,
  name: row.name,
  type: row.type,
  content: row.content || '',
  date: '',
  lastModified: row.last_modified,
  lastViewed: row.last_viewed,
  labels: row.labels || [],
  creatorName: row.creator_name,
  creatorType: row.creator_type,
  size: row.size,
  isNew: false,
  isRead: row.is_read,
  source: row.source,
});

const API_BASE = '/api/documents';

export function useDocuments(workspaceId: string, fallbackDocs: any[]) {
  const [documents, setDocuments] = useState<any[]>(fallbackDocs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocs = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}?workspace_id=${workspaceId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: DocRow[] = await res.json();
      if (data && data.length > 0) {
        setDocuments(data.map(toWorkspaceDoc));
      }
      // If empty or error, keep fallback docs
    } catch (e: any) {
      console.warn('[useDocuments] API fetch failed, using fallback:', e.message);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchDocs();
    const interval = setInterval(fetchDocs, 30_000);
    const onVis = () => { if (document.visibilityState === 'visible') fetchDocs(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', onVis); };
  }, [fetchDocs]);

  const createDoc = useCallback(async (doc: Partial<DocRow>) => {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: workspaceId,
          name: doc.name || 'Untitled',
          type: doc.type || 'Markdown',
          content: doc.content || '',
          labels: doc.labels || [],
          creator_name: doc.creator_name || 'Me',
          creator_type: doc.creator_type || 'human',
          source: doc.source || 'normal',
          size: doc.size || 0,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const row: DocRow = await res.json();
      const newDoc = toWorkspaceDoc(row);
      setDocuments(prev => [newDoc, ...prev]);
      return newDoc;
    } catch (e: any) {
      // Fallback: add to local state
      const localDoc = {
        id: crypto.randomUUID(),
        workspaceId,
        name: doc.name || 'Untitled',
        type: doc.type || 'Markdown',
        content: doc.content || '',
        date: 'Just now',
        lastModified: new Date().toISOString(),
        lastViewed: new Date().toISOString(),
        labels: doc.labels || [],
        creatorName: doc.creator_name || 'Me',
        creatorType: doc.creator_type || 'human',
        size: doc.size || 0,
        isNew: true,
        isRead: false,
        source: doc.source || 'normal',
      };
      setDocuments(prev => [localDoc, ...prev]);
      return localDoc;
    }
  }, [workspaceId]);

  const updateDoc = useCallback(async (id: string, updates: Partial<DocRow>) => {
    try {
      const res = await fetch(API_BASE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      // Fallback: update locally
      setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...updates, lastModified: new Date().toISOString() } : d));
    }
  }, []);

  const deleteDoc = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch {
      setDocuments(prev => prev.filter(d => d.id !== id));
    }
  }, []);

  return { documents, setDocuments, loading, error, createDoc, updateDoc, deleteDoc };
}
