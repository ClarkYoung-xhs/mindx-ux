-- MindX Vercel Postgres Schema & Seed Data
-- Run this in Vercel Postgres console (Storage → Data → Query)

-- ============================================================
-- 1. Create Tables
-- ============================================================

CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT,
  labels TEXT[] DEFAULT '{}',
  creator_name TEXT NOT NULL,
  creator_type TEXT NOT NULL DEFAULT 'human',
  source TEXT DEFAULT 'normal',
  size INT DEFAULT 0,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_modified TIMESTAMPTZ DEFAULT NOW(),
  last_viewed TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_type TEXT NOT NULL DEFAULT 'human',
  action TEXT NOT NULL,
  action_zh TEXT,
  target_name TEXT NOT NULL,
  target_type TEXT NOT NULL,
  doc_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  details TEXT,
  details_zh TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. Seed Documents (sample data)
-- ============================================================

INSERT INTO documents (id, workspace_id, name, type, labels, creator_name, creator_type, source, size, is_read, last_modified, last_viewed) VALUES
  ('00000000-0000-0000-0000-000000000001', 'w1', 'Project Alpha Architecture', 'Smart Doc', '{"Project Alpha","PRD"}', 'Claude Assistant', 'agent', 'normal', 32768, false, '2026-03-27T12:00:00Z', '2026-03-27T13:30:00Z'),
  ('00000000-0000-0000-0000-000000000002', 'w1', 'Q3 Financial Projections', 'Table', '{"Data","Finance"}', 'Data Analyzer', 'agent', 'normal', 65536, true, '2026-03-23T10:00:00Z', '2026-03-24T09:00:00Z'),
  ('00000000-0000-0000-0000-000000000003', 'w1', 'User Flow Diagram', 'Whiteboard', '{"Design","Project Alpha"}', 'Me', 'human', 'normal', 128000, true, '2026-03-17T15:00:00Z', '2026-03-22T11:00:00Z'),
  ('00000000-0000-0000-0000-000000000004', 'w1', 'Competitor Analysis', 'Markdown', '{"Research","Data"}', 'Research Bot', 'agent', 'normal', 40960, false, '2026-03-27T13:00:00Z', '2026-03-27T13:45:00Z'),
  ('00000000-0000-0000-0000-000000000005', 'w1', 'Marketing Strategy', 'Smart Doc', '{"PRD","Marketing"}', 'Me', 'human', 'normal', 53248, true, '2026-03-22T14:00:00Z', '2026-03-23T16:00:00Z'),
  ('00000000-0000-0000-0000-000000000006', 'w1', 'Claude & Maya: Feature Discussion', 'Smart Doc', '{"Meeting Notes"}', 'Claude Assistant', 'agent', 'normal', 24576, false, '2026-03-27T11:00:00Z', '2026-03-27T11:30:00Z'),
  ('00000000-0000-0000-0000-000000000007', 'w1', 'Industry Digest — Mar 27', 'Markdown', '{"Daily Industry Digest"}', 'Research Bot', 'agent', 'scheduled', 45056, false, '2026-03-27T08:00:00Z', '2026-03-27T10:00:00Z'),
  ('00000000-0000-0000-0000-000000000008', 'w1', 'Daily Report — Mar 27', 'Markdown', '{"Daily Report"}', 'Claude Assistant', 'agent', 'scheduled', 73728, false, '2026-03-27T17:00:00Z', '2026-03-27T17:30:00Z');

-- ============================================================
-- 3. Seed Activities
-- ============================================================

INSERT INTO activities (workspace_id, user_id, user_name, user_type, action, action_zh, target_name, target_type, doc_id, details, details_zh, created_at) VALUES
  ('w1', 'a1', 'Claude Assistant', 'agent', 'updated', '更新了', 'Project Alpha Architecture', 'Smart Doc', '00000000-0000-0000-0000-000000000001', 'Revised system architecture', '修订了系统架构', '2026-03-27T12:00:00Z'),
  ('w1', 'a3', 'Research Bot', 'agent', 'updated', '更新了', 'Competitor Analysis', 'Markdown', '00000000-0000-0000-0000-000000000004', 'Added Q1 market share data', '新增了 Q1 市场份额数据', '2026-03-27T13:00:00Z'),
  ('w1', 'a1', 'Claude Assistant', 'agent', 'created', '创建了', 'Daily Report — Mar 27', 'Markdown', '00000000-0000-0000-0000-000000000008', 'Scheduled task: daily summary', '定时任务：每日汇总', '2026-03-27T17:00:00Z');
