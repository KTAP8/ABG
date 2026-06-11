-- Add category and gender columns to products table
ALTER TABLE "products" ADD COLUMN "category" text DEFAULT 'accessories';
ALTER TABLE "products" ADD COLUMN "gender" text DEFAULT 'unisex';

-- Create product_categories reference table
CREATE TABLE "product_categories" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  name_th text,
  created_at timestamp with time zone DEFAULT now()
);

-- Insert default categories
INSERT INTO "product_categories" (slug, name, name_th) VALUES
  ('tops', 'Tops', 'เสื้อผ้า'),
  ('bottoms', 'Bottoms', 'กางเกง'),
  ('accessories', 'Accessories', 'อุปกรณ์เสริม');
