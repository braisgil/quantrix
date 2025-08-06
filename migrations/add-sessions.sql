-- Create session status enum
CREATE TYPE session_status AS ENUM ('active', 'archived', 'completed');

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  status session_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for sessions table
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_agent_id_idx ON sessions(agent_id);
CREATE INDEX IF NOT EXISTS sessions_status_idx ON sessions(status);
CREATE INDEX IF NOT EXISTS sessions_created_at_idx ON sessions(created_at);

-- Add session_id column to conversations table
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Migrate existing conversations to use sessions
-- This creates a default session for each unique agent-user combination
INSERT INTO sessions (id, name, description, user_id, agent_id, status, created_at, updated_at)
SELECT 
  'default_' || MD5(CONCAT(user_id, agent_id)),
  'Default Session for ' || (SELECT name FROM agents WHERE agents.id = conversations.agent_id LIMIT 1),
  'Automatically created session for existing conversations',
  user_id,
  agent_id,
  'active',
  MIN(created_at),
  NOW()
FROM conversations
WHERE session_id IS NULL
GROUP BY user_id, agent_id;

-- Update conversations to reference the created sessions
UPDATE conversations
SET session_id = 'default_' || MD5(CONCAT(user_id, agent_id))
WHERE session_id IS NULL;

-- Make session_id NOT NULL after migration
ALTER TABLE conversations ALTER COLUMN session_id SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE conversations ADD CONSTRAINT conversations_session_id_fkey 
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE;

-- Drop the old agent_id column from conversations (as it's now referenced through sessions)
ALTER TABLE conversations DROP COLUMN IF EXISTS agent_id;

-- Drop old index if it exists
DROP INDEX IF EXISTS conversations_agent_id_idx;

-- Create new index for session_id
CREATE INDEX IF NOT EXISTS conversations_session_id_idx ON conversations(session_id);