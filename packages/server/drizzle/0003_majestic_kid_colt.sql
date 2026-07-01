CREATE TABLE "iykyk_signups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"ig_handle" text,
	"discount_code" text NOT NULL,
	"discount_amount" integer DEFAULT 50 NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "iykyk_signups_email_unique" UNIQUE("email"),
	CONSTRAINT "iykyk_signups_discount_code_unique" UNIQUE("discount_code")
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"name_th" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "product_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "category" text DEFAULT 'accessories';--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "gender" text DEFAULT 'unisex';