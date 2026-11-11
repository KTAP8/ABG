ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "free_shipping" boolean DEFAULT false NOT NULL;
