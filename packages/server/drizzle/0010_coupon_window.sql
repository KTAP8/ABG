ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "multi_use" boolean DEFAULT false NOT NULL;
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "starts_at" timestamp with time zone;
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "expires_at" timestamp with time zone;
