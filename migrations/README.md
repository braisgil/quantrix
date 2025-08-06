# Database Migration Instructions

## Sessions Feature Migration

This migration introduces the new Sessions feature that wraps Conversations.

### What this migration does:
1. Creates a new `sessions` table to organize conversations by topic
2. Updates the `conversations` table to reference sessions instead of agents directly
3. Migrates existing conversations to default sessions (one per agent-user combination)
4. Updates the foreign key relationships

### How to run the migration:

#### Option 1: Using Drizzle Kit (Recommended)
```bash
# Generate the migration
npm run db:generate

# Push the changes to your database
npm run db:push
```

#### Option 2: Manual SQL Execution
If you prefer to run the SQL manually, execute the `add-sessions.sql` file against your database:

```bash
# For PostgreSQL
psql -U your_username -d your_database -f migrations/add-sessions.sql
```

### Important Notes:
- **Backup your database** before running this migration
- Existing conversations will be automatically migrated to default sessions
- Each unique agent-user combination will get its own default session
- The application will now require creating sessions before creating conversations

### Rollback (if needed):
To rollback this migration, you would need to:
1. Drop the sessions table
2. Re-add the agent_id column to conversations
3. Restore the foreign key relationships

Always test migrations in a development environment first!