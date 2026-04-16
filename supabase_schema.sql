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

-- 2. User Profile
CREATE TABLE IF NOT EXISTS user_profile (
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  key TEXT NOT NULL,
  value TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (workspace_id, key)
);

-- 3. Key Points
CREATE TABLE IF NOT EXISTS keypoints (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  title TEXT NOT NULL,
  type TEXT DEFAULT 'insight',
  text TEXT NOT NULL,
  source TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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
  creator_name TEXT,
  creator_type TEXT DEFAULT 'human',
  source TEXT DEFAULT 'normal',
  size INTEGER DEFAULT 0,
  is_read BOOLEAN DEFAULT FALSE,
  last_viewed TIMESTAMPTZ,
  last_modified TIMESTAMPTZ DEFAULT NOW()
);
