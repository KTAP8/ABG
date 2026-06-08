import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

export default function About() {
  const { i18n } = useTranslation()
  const isTh = i18n.language === 'th'

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="mb-16">
          <h1 className="font-display font-bold text-5xl md:text-6xl uppercase text-charcoal mb-4">
            ABOUT ABG
          </h1>
          <p className="font-body text-lg text-charcoal">
            {isTh
              ? 'เรื่องราวของแบรนด์ที่เกิดจากวัฒนาการ ความรักในสัญลักษณ์ และความหวังที่จะมีชุมชน'
              : 'A brand born from evolution, a love of symbolism, and a desire for community.'}
          </p>
        </div>

        {/* Section 1: The Name */}
        <section className="mb-16 pb-8 border-b border-charcoal">
          <h2 className="font-display font-bold text-3xl uppercase text-charcoal mb-6">
            {isTh ? 'ชื่อ' : 'The Name'}
          </h2>
          <div className="space-y-4 font-body text-base leading-relaxed text-charcoal">
            {isTh ? (
              <>
                <p>
                  "ACOUSTIC BUT GOATED" เกิดจากการนำเสนอความเป็นจริงของแรนด์ โดยหมายถึง "บริสุทธิ์แต่มีศักดิ์ศรี" ประเมิน ทดลอง และค้นหาคุณค่า
                </p>
                <p>
                  คำว่า Acoustic หมายถึงการที่เราไม่ต้องการแต่งหน้า หรือปกปิดความจริง เพียงแต่ส่งสิ่งที่ดีที่สุดมาให้คุณ ด้วยสีสันของสตูดิโอกลาง ไม่ใช่เศษซากของความหรูหรา
                </p>
              </>
            ) : (
              <>
                <p>
                  "ACOUSTIC BUT GOATED" presents the unvarnished truth of the brand: raw but revered. Pure but powerful. We don't need the production value—just the goods.
                </p>
                <p>
                  Acoustic. Not because we're lo-fi. Because we're honest. Everything here is stripped to what matters: the product, the story, and the community that wears it.
                </p>
              </>
            )}
          </div>
        </section>

        {/* Section 2: The Problem */}
        <section className="mb-16 pb-8 border-b border-charcoal">
          <h2 className="font-display font-bold text-3xl uppercase text-charcoal mb-6">
            {isTh ? 'ปัญหา' : 'The Problem'}
          </h2>
          <div className="space-y-4 font-body text-base leading-relaxed text-charcoal">
            {isTh ? (
              <>
                <p>
                  สัญลักษณ์แบรนด์นอกเหนือจากสัญลักษณ์สัมยาน มักจะมาจากไกล ราคาแพง และทำให้รู้สึกว่าไม่ใช่ของเรา
                </p>
                <p>
                  กำลังหลังของสัญลักษณ์ที่เราใช้ในชีวิตประจำวันค้นหามาจากนานกว่านี้ จากต่างแดนห่างไกล ไม่เคยติดตั้งสำหรับเรา
                </p>
              </>
            ) : (
              <>
                <p>
                  Symbols of culture are often sold as imports. They arrive from abroad, marked up through distribution, stripped of context. They don't feel like ours.
                </p>
                <p>
                  We wanted to create something that felt native. Something that documented our campus, our time, our inside jokes. Merch that actually means something.
                </p>
              </>
            )}
          </div>
        </section>

        {/* Section 3: The Product */}
        <section className="mb-16 pb-8 border-b border-charcoal">
          <h2 className="font-display font-bold text-3xl uppercase text-charcoal mb-6">
            {isTh ? 'สินค้า' : 'The Product'}
          </h2>
          <div className="space-y-4 font-body text-base leading-relaxed text-charcoal">
            {isTh ? (
              <>
                <p>
                  ไม่ใช่เสื้อสเลิร์ต เป็นแบบฟอร์ม ของแล้วสล่ำเลียดแบบ เครื่องสม่วมสำหรับแนวชีวิต
                </p>
                <p>
                  ใส่สิ่งนี้หมายความว่า: ฉันอยู่ที่นี่ ฉันเป็นส่วนหนึ่งของมัน ฉันเข้าใจภาษาของแล็บเบล นี่คือจำเป้าของฉัน
                </p>
              </>
            ) : (
              <>
                <p>
                  Not merch. A uniform. A way to announce that you belong. That you understand the code. That this is your campus, your time, your moment.
                </p>
                <p>
                  Each drop documents a chapter. Limited runs. No restocks. Once it's gone, it's history. That's the point.
                </p>
              </>
            )}
          </div>
        </section>

        {/* Section 4: The Community */}
        <section className="mb-16">
          <h2 className="font-display font-bold text-3xl uppercase text-charcoal mb-6">
            {isTh ? 'ชุมชน' : 'The Community'}
          </h2>
          <div className="space-y-4 font-body text-base leading-relaxed text-charcoal">
            {isTh ? (
              <>
                <p>
                  ABG เป็นของคนที่อาศัยอยู่ในสัญลักษณ์แนวคิด สำหรับผู้ที่ขอบสายเชื่อมต่อแนวคิดที่ลึกลงไปกว่า hashtag ที่สั่งซื้อผ่าน QR code
                </p>
                <p>
                  มันเป็นการสนทนา ระหว่างรุ่นที่ใช้แนวคิดเดียวกัน ผู้ที่เข้าใจว่าแฟชั่นเป็นโครงสร้างสังคมไม่ใช่เพียงแค่เสื้อผ้า
                </p>
                <p>
                  ถ้าคุณอยู่ที่นี่ คุณเข้าใจแล้ว อย่าบอกใคร
                </p>
              </>
            ) : (
              <>
                <p>
                  ABG is for people who live in symbolism. For those who understand that fashion is architecture—a way to signal, to belong, to persist.
                </p>
                <p>
                  It's a conversation between people who get it. People who move through campus knowing that what you wear is what you say. That style is syntax.
                </p>
                <p>
                  If you're reading this, you already know. Don't tell everyone.
                </p>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
