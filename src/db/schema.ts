import { boolean, pgEnum, pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const user = pgTable("user", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const session = pgTable("session", {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
}, (table) => ({
  userIdIdx: index('session_user_id_idx').on(table.userId),
  expiresAtIdx: index('session_expires_at_idx').on(table.expiresAt),
}));

export const account = pgTable("account", {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  // Stored as a hash by Better Auth when email/password is enabled
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
}, (table) => ({
  userIdIdx: index('account_user_id_idx').on(table.userId),
  providerIdx: index('account_provider_idx').on(table.providerId),
}));

export const verification = pgTable("verification", {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const agents = pgTable("agents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  instructions: text("instructions").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory").notNull(),
  subSubcategory: text("sub_subcategory").notNull(),
  customRule1: text("custom_rule_1").notNull(),
  customRule2: text("custom_rule_2").notNull(),
  additionalRule1: text("additional_rule_1"),
  additionalRule2: text("additional_rule_2"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('agents_user_id_idx').on(table.userId),
  createdAtIdx: index('agents_created_at_idx').on(table.createdAt),
}));

export const sessionStatus = pgEnum("session_status", [
  "active",
  "archived",
  "completed"
]);

export const sessions = pgTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id, { onDelete: "cascade" }),
  status: sessionStatus("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('sessions_user_id_idx').on(table.userId),
  agentIdIdx: index('sessions_agent_id_idx').on(table.agentId),
  statusIdx: index('sessions_status_idx').on(table.status),
  createdAtIdx: index('sessions_created_at_idx').on(table.createdAt),
}));

export const conversationStatus = pgEnum("conversation_status", [
  "scheduled",
  "available",
  "active",
  "completed",
  "processing",
  "cancelled"
]);

export const conversations = pgTable("conversations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  sessionId: text("session_id")
    .notNull()
    .references(() => sessions.id, { onDelete: "cascade" }),
  status: conversationStatus("status").notNull().default("scheduled"),
  scheduledDateTime: timestamp("scheduled_date_time"),
  availableAt: timestamp("available_at"),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  summary: text("summary"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('conversations_user_id_idx').on(table.userId),
  sessionIdIdx: index('conversations_session_id_idx').on(table.sessionId),
  statusIdx: index('conversations_status_idx').on(table.status),
  availableAtIdx: index('conversations_available_at_idx').on(table.availableAt),
  createdAtIdx: index('conversations_created_at_idx').on(table.createdAt),
}));

// Credit and usage tracking tables
export const creditTransactionType = pgEnum("credit_transaction_type", [
  "purchase",
  "usage",
  "refund",
  "adjustment",
  "expiration"
]);

export const usageServiceType = pgEnum("usage_service_type", [
  "openai_gpt4o",
  "openai_gpt4o_mini",
  "stream_video_call",
  "stream_chat_message",
  "stream_transcription",
]);

export const creditBalances = pgTable("credit_balances", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  availableCredits: text("available_credits").notNull().default("0"), // Using text for precision decimal
  totalPurchased: text("total_purchased").notNull().default("0"),
  totalUsed: text("total_used").notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('credit_balances_user_id_idx').on(table.userId),
}));

export const creditTransactions = pgTable("credit_transactions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: creditTransactionType("type").notNull(),
  amount: text("amount").notNull(), // Positive for credits added, negative for credits used
  balanceBefore: text("balance_before").notNull(),
  balanceAfter: text("balance_after").notNull(),
  description: text("description"),
  metadata: text("metadata"), // JSON string for additional data
  polarCheckoutId: text("polar_checkout_id"),
  polarTransactionId: text("polar_transaction_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('credit_transactions_user_id_idx').on(table.userId),
  typeIdx: index('credit_transactions_type_idx').on(table.type),
  createdAtIdx: index('credit_transactions_created_at_idx').on(table.createdAt),
  polarCheckoutIdx: index('credit_transactions_polar_checkout_idx').on(table.polarCheckoutId),
}));

export const usageEvents = pgTable("usage_events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  service: usageServiceType("service").notNull(),
  quantity: text("quantity").notNull(), // Units depend on service (tokens, minutes, messages, etc.)
  unitCost: text("unit_cost").notNull(), // Cost per unit in credits
  totalCost: text("total_cost").notNull(), // Total cost in credits
  resourceId: text("resource_id"), // Reference to conversation, session, etc.
  resourceType: text("resource_type"), // "conversation", "session", "chat"
  metadata: text("metadata"), // JSON string for service-specific data
  polarEventId: text("polar_event_id"), // ID of the event sent to Polar
  processed: boolean("processed").notNull().default(false),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('usage_events_user_id_idx').on(table.userId),
  serviceIdx: index('usage_events_service_idx').on(table.service),
  processedIdx: index('usage_events_processed_idx').on(table.processed),
  resourceIdx: index('usage_events_resource_idx').on(table.resourceId, table.resourceType),
  createdAtIdx: index('usage_events_created_at_idx').on(table.createdAt),
}));

export const servicePricing = pgTable("service_pricing", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  service: usageServiceType("service").notNull().unique(),
  unitPrice: text("unit_price").notNull(), // Base price per unit in USD
  creditConversionRate: text("credit_conversion_rate").notNull(), // Credits per USD (after profit margin)
  profitMargin: text("profit_margin").notNull().default("0.20"), // Default 20% profit margin
  isActive: boolean("is_active").notNull().default(true),
  metadata: text("metadata"), // JSON string for additional pricing rules
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  serviceIdx: index('service_pricing_service_idx').on(table.service),
  isActiveIdx: index('service_pricing_is_active_idx').on(table.isActive),
}));

export const creditPackages = pgTable("credit_packages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  polarProductId: text("polar_product_id").notNull().unique(),
  credits: text("credits").notNull(), // Number of credits in the package
  price: text("price").notNull(), // Price in USD
  bonusCredits: text("bonus_credits").notNull().default("0"), // Extra credits for bulk purchases
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  polarProductIdIdx: index('credit_packages_polar_product_id_idx').on(table.polarProductId),
  isActiveIdx: index('credit_packages_is_active_idx').on(table.isActive),
}));