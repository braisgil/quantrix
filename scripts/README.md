# Database Setup Scripts

## Credit System Setup

The credit system is automatically set up when you run:

```bash
npm run db:push
```

This will:
1. Push the schema to the database (using drizzle-kit)
2. Set up all credit system data automatically

You can also run the credit setup separately:

```bash
npm run db:setup:credits
```

### Important Notes

1. **DATABASE_URL Format**: Make sure your DATABASE_URL in `.env` does NOT have quotes around it:
   ```
   # Correct
   DATABASE_URL=postgresql://user:pass@host/db
   
   # Wrong (will fail)
   DATABASE_URL='postgresql://user:pass@host/db'
   ```

2. **Environment Variables**: If you have DATABASE_URL set in your shell environment, it will override the `.env` file. To use the `.env` value explicitly:
   ```bash
   DATABASE_URL=$(grep DATABASE_URL .env | cut -d= -f2- | tr -d "'\"") npm run db:setup:credits
   ```

3. **Idempotent**: The migration is idempotent - you can run it multiple times safely. It will skip existing objects and update data where appropriate.

### What it does:

- Creates credit system types (enums)
- Creates tables: credit_balances, credit_transactions, usage_events, service_pricing, credit_packages
- Creates indexes for performance
- Inserts default service pricing
- Inserts credit packages (linked to Polar products)
- Initializes credit balances for existing users
- Sets up triggers for automatic timestamp updates

### Verification

After running the migration, you can verify it worked:

```bash
# Check credit packages
node -e "
require('dotenv/config');
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL?.replace(/^['\"]|['\"]$/g, ''));
sql\`SELECT name, price, credits FROM credit_packages WHERE is_active = true ORDER BY price\`.then(r => {
  console.log('Credit packages:', r);
});
"
```

### Troubleshooting

1. **"password authentication failed"**: Check that DATABASE_URL doesn't have quotes
2. **"function nanoid() does not exist"**: The script now generates IDs in JavaScript
3. **No data inserted**: Check the console output - the script reports each step
