import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

export default function About() {
  const { i18n } = useTranslation()
  const isTh = i18n.language === 'th'

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="border border-charcoal p-6 bg-cream mb-12">
          <span className="font-mono text-[9px] tracking-widest text-charcoal/50 uppercase block">// BRAND_MANIFESTO</span>
          <h1 className="font-display font-black text-3xl md:text-5xl uppercase text-charcoal mt-1">
            ABOUT ABG
          </h1>
          <p className="font-mono text-xs text-charcoal/70 mt-2">
            // STATUS: {isTh ? 'เปิดเผย' : 'UNCLASSIFIED'} // REG_REV: 004
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1: The Name */}
          <div className="border border-charcoal bg-cream">
            <div className="flex justify-between items-center border-b border-charcoal px-6 py-3 font-mono text-[9px] tracking-widest text-charcoal/60">
              <span>INDEX_REF // 01</span>
              <span>SEC: {isTh ? 'ชื่อ' : 'THE_NAME'}</span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 font-body text-xs leading-relaxed text-charcoal">
              <div className="space-y-3">
                <span className="font-mono text-[9px] tracking-widest text-red font-bold block">// REGISTER_TH</span>
                <p>
                  "ACOUSTIC BUT GOATED" เกิดจากการนำเสนอความเป็นจริงของแบรนด์ โดยหมายถึง "บริสุทธิ์แต่มีศักดิ์ศรี" ประเมิน ทดลอง และค้นหาคุณค่า
                </p>
                <p>
                  คำว่า Acoustic หมายถึงการที่เราไม่ต้องการแต่งหน้า หรือปกปิดความจริง เพียงแต่ส่งสิ่งที่ดีที่สุดมาให้คุณ ด้วยสีสันของสตูดิโอกลาง ไม่ใช่เศษซากของความหรูหรา
                </p>
              </div>
              <div className="space-y-3 border-t md:border-t-0 md:border-l border-charcoal/20 pt-6 md:pt-0 md:pl-6">
                <span className="font-mono text-[9px] tracking-widest text-charcoal/40 block">// REGISTER_EN</span>
                <p>
                  "ACOUSTIC BUT GOATED" presents the unvarnished truth of the brand: raw but revered. Pure but powerful. We don't need the production value—just the goods.
                </p>
                <p>
                  Acoustic. Not because we're lo-fi. Because we're honest. Everything here is stripped to what matters: the product, the story, and the community that wears it.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: The Problem */}
          <div className="border border-charcoal bg-cream">
            <div className="flex justify-between items-center border-b border-charcoal px-6 py-3 font-mono text-[9px] tracking-widest text-charcoal/60">
              <span>INDEX_REF // 02</span>
              <span>SEC: {isTh ? 'ปัญหา' : 'THE_PROBLEM'}</span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 font-body text-xs leading-relaxed text-charcoal">
              <div className="space-y-3">
                <span className="font-mono text-[9px] tracking-widest text-red font-bold block">// REGISTER_TH</span>
                <p>
                  สัญลักษณ์แบรนด์นอกเหนือจากสัญลักษณ์สัมยาน มักจะมาจากไกล ราคาแพง และทำให้รู้สึกว่าไม่ใช่ของเรา
                </p>
                <p>
                  กำลังหลังของสัญลักษณ์ที่เราใช้ในชีวิตประจำวันค้นหามาจากนานกว่านี้ จากต่างแดนห่างไกล ไม่เคยติดตั้งสำหรับเรา
                </p>
              </div>
              <div className="space-y-3 border-t md:border-t-0 md:border-l border-charcoal/20 pt-6 md:pt-0 md:pl-6">
                <span className="font-mono text-[9px] tracking-widest text-charcoal/40 block">// REGISTER_EN</span>
                <p>
                  Symbols of culture are often sold as imports. They arrive from abroad, marked up through distribution, stripped of context. They don't feel like ours.
                </p>
                <p>
                  We wanted to create something that felt native. Something that documented our campus, our time, our inside jokes. Merch that actually means something.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: The Product */}
          <div className="border border-charcoal bg-cream">
            <div className="flex justify-between items-center border-b border-charcoal px-6 py-3 font-mono text-[9px] tracking-widest text-charcoal/60">
              <span>INDEX_REF // 03</span>
              <span>SEC: {isTh ? 'สินค้า' : 'THE_PRODUCT'}</span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 font-body text-xs leading-relaxed text-charcoal">
              <div className="space-y-3">
                <span className="font-mono text-[9px] tracking-widest text-red font-bold block">// REGISTER_TH</span>
                <p>
                  ไม่ใช่เสื้อสเลิร์ต เป็นแบบฟอร์ม ของแล้วสล่ำเลียดแบบ เครื่องสม่วมสำหรับแนวชีวิต
                </p>
                <p>
                  ใส่สิ่งนี้หมายความว่า: ฉันอยู่ที่นี่ ฉันเป็นส่วนหนึ่งของมัน ฉันเข้าใจภาษาของแล็บเบล นี่คือจำเป้าของฉัน
                </p>
              </div>
              <div className="space-y-3 border-t md:border-t-0 md:border-l border-charcoal/20 pt-6 md:pt-0 md:pl-6">
                <span className="font-mono text-[9px] tracking-widest text-charcoal/40 block">// REGISTER_EN</span>
                <p>
                  Not merch. A uniform. A way to announce that you belong. That you understand the code. That this is your campus, your time, your moment.
                </p>
                <p>
                  Each drop documents a chapter. Limited runs. No restocks. Once it's gone, it's history. That's the point.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: The Community */}
          <div className="border border-charcoal bg-cream">
            <div className="flex justify-between items-center border-b border-charcoal px-6 py-3 font-mono text-[9px] tracking-widest text-charcoal/60">
              <span>INDEX_REF // 04</span>
              <span>SEC: {isTh ? 'ชุมชน' : 'THE_COMMUNITY'}</span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 font-body text-xs leading-relaxed text-charcoal">
              <div className="space-y-3">
                <span className="font-mono text-[9px] tracking-widest text-red font-bold block">// REGISTER_TH</span>
                <p>
                  ABG เป็นของคนที่อาศัยอยู่ในสัญลักษณ์แนวคิด สำหรับผู้ที่ขอบสายเชื่อมต่อแนวคิดที่ลึกลงไปกว่า hashtag ที่สั่งซื้อผ่าน QR code
                </p>
                <p>
                  มันเป็นการสนทนา ระหว่างรุ่นที่ใช้แนวคิดเดียวกัน ผู้ที่เข้าใจว่าแฟชั่นเป็นโครงสร้างสังคมไม่ใช่เพียงแค่เสื้อผ้า
                </p>
                <p>
                  ถ้าคุณอยู่ที่นี่ คุณเข้าใจแล้ว อย่าบอกใคร
                </p>
              </div>
              <div className="space-y-3 border-t md:border-t-0 md:border-l border-charcoal/20 pt-6 md:pt-0 md:pl-6">
                <span className="font-mono text-[9px] tracking-widest text-charcoal/40 block">// REGISTER_EN</span>
                <p>
                  ABG is for people who live in symbolism. For those who understand that fashion is architecture—a way to signal, to belong, to persist.
                </p>
                <p>
                  It's a conversation between people who get it. People who move through campus knowing that what you wear is what you say. That style is syntax.
                </p>
                <p>
                  If you're reading this, you already know. Don't tell everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
