import {
  pgTable,
  text,
  uuid,
  boolean,
  timestamp,
  integer,
  unique,
} from 'drizzle-orm/pg-core'

export const drops = pgTable('drops', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  name_th: text('name_th'),
  description: text('description'),
  description_th: text('description_th'),
  drop_at: timestamp('drop_at', { withTimezone: true }).notNull(),
  is_active: boolean('is_active').default(false),
  google_form_url: text('google_form_url'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const product_categories = pgTable('product_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  name_th: text('name_th'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  name_th: text('name_th'),
  description: text('description'),
  description_th: text('description_th'),
  price: integer('price').notNull(), // THB in baht
  drop_id: uuid('drop_id').references(() => drops.id),
  category: text('category').default('accessories'),
  gender: text('gender').default('unisex'), // 'men', 'women', 'unisex'
  is_active: boolean('is_active').default(true),
  google_form_url: text('google_form_url'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const product_variants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  product_id: uuid('product_id').references(() => products.id),
  size: text('size').notNull(), // 'XS','S','M','L','XL','FREESIZE'
  color: text('color'),
  sku: text('sku').unique(),
  stock: integer('stock').default(0),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const product_images = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  product_id: uuid('product_id').references(() => products.id),
  url: text('url').notNull(),
  position: integer('position').default(0),
  alt_text: text('alt_text'),
  color: text('color'),
})

export const waitlist = pgTable(
  'waitlist',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull(),
    drop_id: uuid('drop_id').references(() => drops.id),
    phone: text('phone'),
    campus: text('campus'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    unique_email_drop: unique().on(table.email, table.drop_id),
  }),
)

export const admin_users = pgTable('admin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  name: text('name'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const iykyk_signups = pgTable('iykyk_signups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  ig_handle: text('ig_handle'),
  discount_code: text('discount_code').unique().notNull(),
  discount_amount: integer('discount_amount').notNull().default(50),
  used_at: timestamp('used_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
