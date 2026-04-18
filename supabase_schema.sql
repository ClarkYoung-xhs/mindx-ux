-- Supabase tables for MindX
-- Run this in Supabase SQL Editor

-- 1. Raw Data
CREATE TABLE IF NOT EXISTS rawdata (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  name TEXT NOT NULL,
  type TEXT DEFAULT 'TXT',
  size INTEGER DEFAULT 0,
  source TEXT DEFAULT 'paste',
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profile Identity (Seed Layer)
CREATE TABLE IF NOT EXISTS profile_identity (
  workspace_id TEXT PRIMARY KEY,
  professional_role TEXT NOT NULL DEFAULT '',
  current_goal TEXT NOT NULL DEFAULT '',
  core_boundary TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Profile Signals (Behavioral Engine)
CREATE TABLE IF NOT EXISTS profile_signals (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  dimension TEXT CHECK (dimension IN ('Preference', 'Judgment', 'Choice', 'Decision')) NOT NULL,
  summary TEXT NOT NULL,
  context TEXT NOT NULL DEFAULT '',
  original_quote TEXT NOT NULL DEFAULT '',
  source_doc_id TEXT DEFAULT '',
  source_doc_name TEXT DEFAULT '',
  confidence FLOAT DEFAULT 1.0,
  weight INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_profile_signals_workspace_dim ON profile_signals(workspace_id, dimension);

-- 4. Activities
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  user_id TEXT,
  user_name TEXT,
  user_type TEXT DEFAULT 'human',
  action TEXT,
  action_zh TEXT,
  target_name TEXT,
  target_type TEXT,
  doc_id TEXT,
  details TEXT,
  details_zh TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Documents
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  name TEXT,
  type TEXT DEFAULT 'Markdown',
  content TEXT DEFAULT '',
  labels TEXT DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Memory Nodes
CREATE TABLE IF NOT EXISTS memory_nodes (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  type TEXT NOT NULL DEFAULT 'Node',
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Agents
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  name TEXT NOT NULL,
  token TEXT NOT NULL,
  installed_skills JSONB DEFAULT '[]',
  connected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- Migration: from old schema to Profile Engine
-- Run these statements if you have existing data to migrate:
-- ====================================================================

-- Migrate whoami/goal from user_profile KV → profile_identity
-- INSERT INTO profile_identity (workspace_id, professional_role, current_goal)
--   SELECT workspace_id, 
--     COALESCE(MAX(CASE WHEN key='whoami' THEN value END), ''),
--     COALESCE(MAX(CASE WHEN key='goal' THEN value END), '')
--   FROM user_profile GROUP BY workspace_id
--   ON CONFLICT (workspace_id) DO NOTHING;

-- Migrate keypoints → profile_signals
-- INSERT INTO profile_signals (id, workspace_id, dimension, summary, context, original_quote, source_doc_name)
--   SELECT id, workspace_id,
--     CASE WHEN type IN ('preference','judgment','choice','decision') THEN INITCAP(type) ELSE 'Judgment' END,
--     text, '', '', source
--   FROM keypoints
--   ON CONFLICT (id) DO NOTHING;
