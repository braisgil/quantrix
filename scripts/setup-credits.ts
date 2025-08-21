#!/usr/bin/env tsx
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { nanoid } from "nanoid";

// Remove quotes from DATABASE_URL if present
const dbUrl = process.env.DATABASE_URL?.replace(/^['"]|['"]$/g, '');
if (!dbUrl) {
  console.error("❌ DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(dbUrl);

type NeonExecutor = {
  unsafe?: (query: string) => Promise<unknown>;
  (query: string): Promise<unknown>;
  (strings: TemplateStringsArray, ...values: unknown[]): Promise<unknown>;
};

function isPgError(e: unknown): e is { code?: string; message?: string; detail?: string } {
  return typeof e === "object" && e !== null;
}

async function runSQL(query: string, description: string): Promise<boolean> {
  try {
    // Use sql.unsafe for raw SQL queries when available
    const exec = sql as unknown as NeonExecutor;
    if (typeof exec.unsafe === "function") {
      await exec.unsafe(query);
    } else {
      // Fallback: allow direct execution (some environments support it)
      await exec(query);
    }
    // eslint-disable-next-line no-console
    console.log(`  ✅ ${description}`);
    return true;
  } catch (e: unknown) {
    const err = isPgError(e) ? e : undefined;
    if (err?.code === '42710' || err?.code === '42P07' || err?.code === '23505') {
      // eslint-disable-next-line no-console
      console.log(`  ⏭️  ${description} (already exists)`);
      return true;
    }
    console.error(`  ❌ Failed: ${description}`);
    console.error(`     Error: ${err?.message ?? 'Unknown error'}`);
    return false;
  }
}

async function main() {
  // eslint-disable-next-line no-console
  console.log("🚀 Starting credit system migration...\n");

  try {
    // Test connection
    await sql`SELECT 1`;
    // eslint-disable-next-line no-console
    console.log("✅ Database connection established\n");

    // Create types
    // eslint-disable-next-line no-console
    console.log("📦 Creating types...");
    await runSQL(`
      CREATE TYPE credit_transaction_type AS ENUM (
        'purchase', 'usage', 'refund', 'adjustment', 'expiration'
      )
    `, "credit_transaction_type");

    await runSQL(`
      CREATE TYPE usage_service_type AS ENUM (
        'openai_gpt4o', 'openai_gpt4o_mini', 'stream_video_call', 
        'stream_chat_message', 'stream_transcription'
      )
    `, "usage_service_type");

    // Create tables
    // eslint-disable-next-line no-console
    console.log("\n📊 Creating tables...");
    
    await runSQL(`
      CREATE TABLE IF NOT EXISTS credit_balances (
        id TEXT PRIMARY KEY DEFAULT nanoid(),
        user_id TEXT NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
        available_credits TEXT NOT NULL DEFAULT '0',
        total_purchased TEXT NOT NULL DEFAULT '0',
        total_used TEXT NOT NULL DEFAULT '0',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `, "credit_balances table");

    await runSQL(`
      CREATE TABLE IF NOT EXISTS credit_transactions (
        id TEXT PRIMARY KEY DEFAULT nanoid(),
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        type credit_transaction_type NOT NULL,
        amount TEXT NOT NULL,
        balance_after TEXT NOT NULL,
        description TEXT,
        metadata JSONB,
        polar_checkout_id TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `, "credit_transactions table");

    await runSQL(`
      CREATE TABLE IF NOT EXISTS usage_events (
        id TEXT PRIMARY KEY DEFAULT nanoid(),
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        service usage_service_type NOT NULL,
        quantity TEXT NOT NULL,
        credit_cost TEXT NOT NULL,
        metadata JSONB,
        resource_id TEXT,
        resource_type TEXT,
        processed BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `, "usage_events table");

    await runSQL(`
      CREATE TABLE IF NOT EXISTS service_pricing (
        id TEXT PRIMARY KEY DEFAULT nanoid(),
        service usage_service_type NOT NULL UNIQUE,
        unit_price TEXT NOT NULL,
        credit_conversion_rate TEXT NOT NULL DEFAULT '800',
        profit_margin TEXT NOT NULL DEFAULT '0.20',
        metadata JSONB,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `, "service_pricing table");

    await runSQL(`
      CREATE TABLE IF NOT EXISTS credit_packages (
        id TEXT PRIMARY KEY DEFAULT nanoid(),
        polar_product_id TEXT NOT NULL UNIQUE,
        credits TEXT NOT NULL,
        price TEXT NOT NULL,
        bonus_credits TEXT NOT NULL DEFAULT '0',
        name TEXT NOT NULL,
        description TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `, "credit_packages table");

    // Create indexes
    // eslint-disable-next-line no-console
    console.log("\n🔍 Creating indexes...");
    await runSQL(`CREATE INDEX IF NOT EXISTS credit_balances_user_id_idx ON credit_balances(user_id)`, "credit_balances_user_id_idx");
    await runSQL(`CREATE INDEX IF NOT EXISTS credit_transactions_user_id_idx ON credit_transactions(user_id)`, "credit_transactions_user_id_idx");
    await runSQL(`CREATE INDEX IF NOT EXISTS credit_transactions_type_idx ON credit_transactions(type)`, "credit_transactions_type_idx");
    await runSQL(`CREATE INDEX IF NOT EXISTS credit_transactions_created_at_idx ON credit_transactions(created_at)`, "credit_transactions_created_at_idx");
    await runSQL(`CREATE INDEX IF NOT EXISTS credit_transactions_polar_checkout_idx ON credit_transactions(polar_checkout_id)`, "credit_transactions_polar_checkout_idx");
    await runSQL(`CREATE INDEX IF NOT EXISTS usage_events_user_id_idx ON usage_events(user_id)`, "usage_events_user_id_idx");
    await runSQL(`CREATE INDEX IF NOT EXISTS usage_events_service_idx ON usage_events(service)`, "usage_events_service_idx");
    await runSQL(`CREATE INDEX IF NOT EXISTS usage_events_processed_idx ON usage_events(processed)`, "usage_events_processed_idx");
    await runSQL(`CREATE INDEX IF NOT EXISTS usage_events_resource_idx ON usage_events(resource_id, resource_type)`, "usage_events_resource_idx");
    await runSQL(`CREATE INDEX IF NOT EXISTS usage_events_created_at_idx ON usage_events(created_at)`, "usage_events_created_at_idx");
    await runSQL(`CREATE INDEX IF NOT EXISTS service_pricing_service_idx ON service_pricing(service)`, "service_pricing_service_idx");
    await runSQL(`CREATE INDEX IF NOT EXISTS service_pricing_is_active_idx ON service_pricing(is_active)`, "service_pricing_is_active_idx");
    await runSQL(`CREATE INDEX IF NOT EXISTS credit_packages_polar_product_id_idx ON credit_packages(polar_product_id)`, "credit_packages_polar_product_id_idx");
    await runSQL(`CREATE INDEX IF NOT EXISTS credit_packages_is_active_idx ON credit_packages(is_active)`, "credit_packages_is_active_idx");

    // Insert service pricing
    // eslint-disable-next-line no-console
    console.log("\n💰 Inserting service pricing...");
    
    const pricingData = [
      ['openai_gpt4o', '0.01', '800', '0.20', '{"inputPricePerMillion": 2.50, "outputPricePerMillion": 10.00}'],
      ['openai_gpt4o_mini', '0.0006', '800', '0.20', '{"inputPricePerMillion": 0.15, "outputPricePerMillion": 0.60}'],
      ['stream_video_call', '0.004', '800', '0.20', '{"pricePerMinute": 0.004}'],
      ['stream_chat_message', '0.0002', '800', '0.20', '{"pricePerMessage": 0.0002}'],
      ['stream_transcription', '0.006', '800', '0.20', '{"pricePerMinute": 0.006}']
    ];

    for (const [service, price, rate, margin, meta] of pricingData) {
      const id = nanoid();
      const result = await sql`
        INSERT INTO service_pricing (id, service, unit_price, credit_conversion_rate, profit_margin, metadata)
        VALUES (${id}, ${service}, ${price}, ${rate}, ${margin}, ${meta}::jsonb)
        ON CONFLICT (service) DO UPDATE SET
          unit_price = EXCLUDED.unit_price,
          credit_conversion_rate = EXCLUDED.credit_conversion_rate,
          updated_at = NOW()
        RETURNING service
      `;
      if (result.length > 0) {
        // eslint-disable-next-line no-console
        console.log(`  ✅ Configured pricing for ${service}`);
      }
    }

    // Insert credit packages
    // eslint-disable-next-line no-console
    console.log("\n📦 Inserting credit packages...");
    
    const packageData = [
      ['8b4a7d8b-bbe0-496c-8b93-8f301d6553ac', '1000', '10', '0', 'Starter Pack', 'Perfect for trying out the platform'],
      ['f5a8efb7-5208-4386-82e5-d40cbefca7d1', '5000', '40', '1000', 'Growth Pack', 'Best value for regular users'],
      ['9f239e93-5e01-44f8-90ad-f9d6c94e6b57', '10000', '75', '2500', 'Pro Pack', 'Ideal for power users'],
      ['571ea6f5-bd88-4076-b187-188295e3f91b', '50000', '350', '15000', 'Enterprise Pack', 'Maximum value for teams']
    ];

    for (const [polar_id, credits, price, bonus, name, desc] of packageData) {
      const id = nanoid();
      const result = await sql`
        INSERT INTO credit_packages (id, polar_product_id, credits, price, bonus_credits, name, description)
        VALUES (${id}, ${polar_id}, ${credits}, ${price}, ${bonus}, ${name}, ${desc})
        ON CONFLICT (polar_product_id) DO UPDATE SET
          credits = EXCLUDED.credits,
          price = EXCLUDED.price,
          bonus_credits = EXCLUDED.bonus_credits,
          name = EXCLUDED.name,
          updated_at = NOW()
        RETURNING name
      `;
      if (result.length > 0) {
        // eslint-disable-next-line no-console
        console.log(`  ✅ Created package: ${name}`);
      }
    }

    // Initialize credit balances
    // eslint-disable-next-line no-console
    console.log("\n👥 Initializing credit balances...");
    // First get all users
    const users = await sql`SELECT id FROM "user"`;
    let initialized = 0;
    for (const user of users) {
      const id = nanoid();
      await sql`
        INSERT INTO credit_balances (id, user_id, available_credits, total_purchased, total_used)
        VALUES (${id}, ${user.id}, '0', '0', '0')
        ON CONFLICT (user_id) DO NOTHING
      `;
      initialized++;
    }
    // eslint-disable-next-line no-console
    console.log(`  ✅ Initialized balances for ${initialized} users`);

    // Create trigger function
    // eslint-disable-next-line no-console
    console.log("\n⚙️  Creating triggers...");
    await runSQL(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `, "update_updated_at_column function");

    // Create triggers
    await runSQL(`
      CREATE TRIGGER update_credit_balances_updated_at 
      BEFORE UPDATE ON credit_balances
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `, "credit_balances trigger");

    await runSQL(`
      CREATE TRIGGER update_service_pricing_updated_at 
      BEFORE UPDATE ON service_pricing
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `, "service_pricing trigger");

    await runSQL(`
      CREATE TRIGGER update_credit_packages_updated_at 
      BEFORE UPDATE ON credit_packages
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `, "credit_packages trigger");

    // Verify
    // eslint-disable-next-line no-console
    console.log("\n✅ Verifying migration...");
    const packages = await sql`SELECT COUNT(*) as count FROM credit_packages WHERE is_active = true`;
    const pricing = await sql`SELECT COUNT(*) as count FROM service_pricing WHERE is_active = true`;
    const balances = await sql`SELECT COUNT(*) as count FROM credit_balances`;

    // eslint-disable-next-line no-console
    console.log(`  📦 Credit packages: ${packages[0].count}`);
    // eslint-disable-next-line no-console
    console.log(`  💰 Service pricing: ${pricing[0].count}`);
    // eslint-disable-next-line no-console
    console.log(`  👥 User balances: ${balances[0].count}`);

    if (Number(packages[0].count) === 0 || Number(pricing[0].count) === 0) {
      throw new Error("Migration verification failed: No data inserted!");
    }

    // eslint-disable-next-line no-console
    console.log("\n🎉 Migration completed successfully!");

  } catch (error: unknown) {
    const err = isPgError(error) ? error : undefined;
    console.error("\n❌ Migration failed:", err?.message ?? 'Unknown error');
    if (err?.detail) {
      console.error("   Details:", err.detail);
    }
    process.exit(1);
  }
}

main();
