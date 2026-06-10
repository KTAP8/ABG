import { db } from './lib/db'
import { drops, products, product_variants, product_images, waitlist } from './lib/schema'

async function seed() {
  try {
    console.log('🌱 Seeding database...')

    // Clear existing data to avoid conflicts
    console.log('Cleaning existing database records...')
    await db.delete(waitlist)
    await db.delete(product_images)
    await db.delete(product_variants)
    await db.delete(products)
    await db.delete(drops)

    // Create drops
    const drop1 = await db
      .insert(drops)
      .values({
        slug: 'samyan-v1',
        name: 'SAMYAN BADDIE V1',
        name_th: 'สามย่าน แบดดี้ V1',
        description:
          'We are creating the unofficial \'Samyan Baddie\' uniform. Effortless everyday wear, but injected with bold, limited-run aesthetics. Our obsession is premium construction—utilizing the same heavyweight fabrics as luxury streetwear labels, but without the gatekept price tag. Only 200 pieces ever made. No restocks.',
        description_th:
          'ชุดเครื่องแบบอย่างไม่เป็นทางการของชาว Samyan Baddie เสื้อผ้าสวมใส่ง่ายในทุกๆ วัน คัสตอมพิเศษเฉพาะรอบนี้เท่านั้น ดีไซน์จัดเต็มเหมือนแบรนด์ลักชูรีสตรีทแวร์ ในราคาที่จับต้องได้ ผลิตเพียง 200 ชิ้นเท่านั้น ไม่มีรีสต็อก',
        drop_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        is_active: true,
        google_form_url:
          'https://forms.gle/placeholder-samyan-v1',
      })
      .returning()

    await db
      .insert(drops)
      .values({
        slug: 'summer-edition',
        name: 'NPC ESCAPE PLAN',
        name_th: 'หลบหนีความ NPC',
        description:
          'We literally fought our print-on-demand supplier to get this puff-print right. A protest against the standard faculty jerseys and standard mass-produced tees that everyone walks around Samyan in. Archived.',
        description_th:
          'ดีไซน์ที่ตั้งใจทำเพื่อหลีกหนีเสื้อผ้า NPC ลายพิมพ์นูนพัฟฟ์หนาพิเศษที่เราสู้รบกับซัพพลายเออร์เพื่อให้งานออกมาดีที่สุด หาสวมใส่จากที่อื่นไม่ได้อีกแล้ว ถูกเก็บเข้ากรุเรียบร้อย',
        drop_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        is_active: false,
        google_form_url:
          'https://forms.gle/placeholder-summer-edition',
      })
      .returning()

    console.log('✓ Created 2 drops')

    // Create products for drop1
    const product1 = await db
      .insert(products)
      .values({
        slug: 'oversized-tee-cream',
        name: 'OVERSIZED TEE',
        name_th: 'เสื้อยืดโอเวอร์ไซส์',
        description: '100% cotton, boxy fit. The essential ABG piece.',
        description_th: '100% คอตตอน ทรงบ็อกซี่ ชิ้นสำคัญของ ABG',
        price: 79000, // ฿790 in satang
        drop_id: drop1[0].id,
        is_active: true,
        google_form_url:
          'https://forms.gle/placeholder-tee-cream',
      })
      .returning()

    const product2 = await db
      .insert(products)
      .values({
        slug: 'cargo-pants-black',
        name: 'CARGO PANTS',
        name_th: 'กางเกงคาร์โก้',
        description:
          'Utility pocket details. Weathered black. Pairs with everything.',
        description_th:
          'ดีเทลกระเป๋า สีดำวินเทจ แมตช์กับทุกอย่าง',
        price: 249000, // ฿2490
        drop_id: drop1[0].id,
        is_active: true,
        google_form_url:
          'https://forms.gle/placeholder-cargo-black',
      })
      .returning()

    const product3 = await db
      .insert(products)
      .values({
        slug: 'baseball-cap-embroidered',
        name: 'BASEBALL CAP',
        name_th: 'หมวกเบสบอล',
        description: 'Embroidered ABG logo. 6-panel structure. Unstructured back.',
        description_th: 'โลโก้ปักเย็บ โครงสร้าง 6 แผง หลังโปร่ง',
        price: 59000, // ฿590
        drop_id: drop1[0].id,
        is_active: true,
        google_form_url:
          'https://forms.gle/placeholder-cap-emb',
      })
      .returning()

    console.log('✓ Created 3 products')

    // Create variants for products
    const variants = [
      { product_id: product1[0].id, size: 'XS', color: 'Cream', stock: 5 },
      { product_id: product1[0].id, size: 'S', color: 'Cream', stock: 12 },
      { product_id: product1[0].id, size: 'M', color: 'Cream', stock: 8 },
      { product_id: product1[0].id, size: 'L', color: 'Cream', stock: 3 },
      { product_id: product1[0].id, size: 'XL', color: 'Cream', stock: 0 },
      { product_id: product1[0].id, size: 'XS', color: 'Black', stock: 10 },
      { product_id: product1[0].id, size: 'S', color: 'Black', stock: 15 },
      { product_id: product1[0].id, size: 'M', color: 'Black', stock: 4 },
      { product_id: product1[0].id, size: 'L', color: 'Black', stock: 8 },
      { product_id: product1[0].id, size: 'XL', color: 'Black', stock: 0 },

      { product_id: product2[0].id, size: 'XS', color: 'Black', stock: 4 },
      { product_id: product2[0].id, size: 'S', color: 'Black', stock: 7 },
      { product_id: product2[0].id, size: 'M', color: 'Black', stock: 9 },
      { product_id: product2[0].id, size: 'L', color: 'Black', stock: 2 },
      { product_id: product2[0].id, size: 'XL', color: 'Black', stock: 1 },

      { product_id: product3[0].id, size: 'FREESIZE', color: 'Black', stock: 15 },
    ]

    await db.insert(product_variants).values(variants)
    console.log('✓ Created 16 product variants')

    // Create product images
    const images = [
      {
        product_id: product1[0].id,
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=667&fit=crop',
        position: 0,
        alt_text: 'Oversized tee cream front',
        color: 'Cream',
      },
      {
        product_id: product1[0].id,
        url: 'https://images.unsplash.com/photo-1592272889254-f7a438b4b9cf?w=500&h=667&fit=crop',
        position: 1,
        alt_text: 'Oversized tee cream back',
        color: 'Cream',
      },
      {
        product_id: product1[0].id,
        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=667&fit=crop',
        position: 2,
        alt_text: 'Oversized tee black front',
        color: 'Black',
      },

      {
        product_id: product2[0].id,
        url: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=667&fit=crop',
        position: 0,
        alt_text: 'Cargo pants front',
        color: 'Black',
      },
      {
        product_id: product2[0].id,
        url: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=667&fit=crop',
        position: 1,
        alt_text: 'Cargo pants detail',
        color: 'Black',
      },

      {
        product_id: product3[0].id,
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=667&fit=crop',
        position: 0,
        alt_text: 'Baseball cap front',
        color: 'Black',
      },
    ]

    await db.insert(product_images).values(images)
    console.log('✓ Created 6 product images')

    console.log('\n✅ Seeding complete!')
    console.log(`
Sample data created:
- 1 upcoming drop (SAMYAN V1) - 7 days from now
- 1 past drop (SUMMER EDITION)
- 3 products with variants
- 11 size/color variants
- 5 placeholder images

Try these endpoints:
  GET /api/drops
  GET /api/drops/samyan-v1
  GET /api/products/oversized-tee-cream
    `)

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
