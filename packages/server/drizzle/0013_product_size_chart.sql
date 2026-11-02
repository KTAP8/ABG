CREATE TABLE IF NOT EXISTS "product_size_chart" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"size" text NOT NULL,
	"bust" text,
	"length" text,
	"sleeve_length" text,
	"shoulder" text,
	"position" integer DEFAULT 0
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_size_chart" ADD CONSTRAINT "product_size_chart_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
