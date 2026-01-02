CREATE TABLE "budgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"category_id" integer NOT NULL,
	"amount" text NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "budgets_user_id_category_id_month_year_key" UNIQUE("user_id","category_id","month","year")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"color" text DEFAULT '#6B7280' NOT NULL,
	"icon" text,
	"description" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "categories_user_id_name_key" UNIQUE("user_id","name")
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"category_id" integer NOT NULL,
	"amount" text NOT NULL,
	"description" text,
	"date" text NOT NULL,
	"payment_method" text,
	"payment_status" text,
	"notes" text,
	"is_recurring" integer DEFAULT 0,
	"recurrence_frequency" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "income_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"icon" text,
	"description" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "incomes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"source" text NOT NULL,
	"amount" text NOT NULL,
	"date" text NOT NULL,
	"description" text,
	"category_id" integer,
	"payment_method" text,
	"is_recurring" integer DEFAULT 0,
	"recurrence_frequency" text,
	"notes" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"bank" text,
	"last_four_digits" text,
	"icon" text,
	"color" text NOT NULL,
	"is_default" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "statistics" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"total_expenses" text DEFAULT '0' NOT NULL,
	"total_income" text DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "statistics_user_id_month_year_key" UNIQUE("user_id","month","year")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"full_name" text,
	"plan" "user_plan" DEFAULT 'free' NOT NULL,
	"plan_expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"avatar_url" text,
	"timezone" text DEFAULT 'America/Mexico_City',
	"language" text DEFAULT 'es',
	"max_monthly_expenses" integer,
	"max_categories" integer,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"preferences" jsonb DEFAULT '{"currency":"MXN","theme":"system"}'::jsonb
);
--> statement-breakpoint
CREATE INDEX "idx_budgets_user_id" ON "budgets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_budgets_category_id" ON "budgets" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_budgets_month_year" ON "budgets" USING btree ("year","month");--> statement-breakpoint
CREATE INDEX "idx_categories_user_id" ON "categories" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_expenses_user_id" ON "expenses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_expenses_category_id" ON "expenses" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_expenses_date" ON "expenses" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_expenses_recurring" ON "expenses" USING btree ("user_id","is_recurring");--> statement-breakpoint
CREATE INDEX "idx_income_categories_user_id" ON "income_categories" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_incomes_user_id" ON "incomes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_incomes_date" ON "incomes" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_payment_methods_user_id" ON "payment_methods" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_statistics_user_id" ON "statistics" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_statistics_month_year" ON "statistics" USING btree ("year","month");--> statement-breakpoint
CREATE INDEX "idx_user_profiles_plan" ON "user_profiles" USING btree ("plan");--> statement-breakpoint
CREATE INDEX "idx_user_profiles_email" ON "user_profiles" USING btree ("email");