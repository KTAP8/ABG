ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "shop_featured" boolean DEFAULT false NOT NULL;
