-- Coupons as source of truth; iykyk_signups references coupons via FK.
-- Prerequisite: truncate/delete mock rows from iykyk_signups (user-managed).

CREATE TABLE IF NOT EXISTS "coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"discount_amount" integer,
	"discount_percent" integer,
	"max_discount_amount" integer,
	"used_at" timestamp with time zone,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "iykyk_signups" DROP CONSTRAINT IF EXISTS "iykyk_signups_discount_code_unique";
--> statement-breakpoint
ALTER TABLE "iykyk_signups" DROP COLUMN IF EXISTS "discount_code";
--> statement-breakpoint
ALTER TABLE "iykyk_signups" DROP COLUMN IF EXISTS "discount_amount";
--> statement-breakpoint
ALTER TABLE "iykyk_signups" DROP COLUMN IF EXISTS "discount_percent";
--> statement-breakpoint
ALTER TABLE "iykyk_signups" DROP COLUMN IF EXISTS "max_discount_amount";
--> statement-breakpoint
ALTER TABLE "iykyk_signups" DROP COLUMN IF EXISTS "used_at";
--> statement-breakpoint
ALTER TABLE "iykyk_signups" ADD COLUMN IF NOT EXISTS "coupon_id" uuid;
--> statement-breakpoint
-- Enforce after table is empty / backfilled:
ALTER TABLE "iykyk_signups" ALTER COLUMN "coupon_id" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "iykyk_signups" ADD CONSTRAINT "iykyk_signups_coupon_id_unique" UNIQUE("coupon_id");
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "iykyk_signups" ADD CONSTRAINT "iykyk_signups_coupon_id_coupons_id_fk"
    FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id")
    ON DELETE no action ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
