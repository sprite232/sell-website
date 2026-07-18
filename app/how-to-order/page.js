'use client';
import Navbar from '@/components/Navbar';
import Icon from '@/components/Icon';
import Link from 'next/link';

const STEPS = [
  {
    icon: 'eye',
    title: 'เลือกสินค้าที่สนใจ',
    desc: 'ดูสินค้าในหน้าหลัก กดเข้าดูรายละเอียดได้เลย ถ้าชอบตัวไหนกดใส่ตะกร้าเพื่อสรุปรายการ',
  },
  {
    icon: 'instagram',
    title: 'DM มาที่ Instagram ร้าน',
    desc: 'ทักมาที่ @sell_second_hand_clothes.th บอกรหัสสินค้า (เช่น S1, S5) หรือแนบรูปสินค้าที่สนใจ',
  },
  {
    icon: 'chatBubble',
    title: 'นัดราคาและยืนยันออเดอร์',
    desc: 'แอดมินจะตอบกลับและยืนยันว่าสินค้ายังว่างอยู่ สอบถามรายละเอียดเพิ่มเติมได้เลย',
  },
  {
    icon: 'creditCard',
    title: 'ชำระเงิน',
    desc: 'โอนเงินผ่านพร้อมเพย์หรือบัญชีธนาคาร แอดมินจะแจ้งข้อมูลให้ทาง DM',
  },
  {
    icon: 'truck',
    title: 'จัดส่งสินค้า',
    desc: 'ส่งพัสดุผ่าน Kerry หรือ Flash — แอดมินจะส่งเลขพัสดุให้ทาง DM หลังโอนเงินแล้ว',
  },
];

const FAQS = [
  {
    q: 'สินค้าของแท้ไหม?',
    a: 'ของแท้ 100% ทุกชิ้นมีที่มาชัดเจน ถ้าต้องการดูรายละเอียดหรือรูปเพิ่มเติม ทักมาถามได้เลย',
  },
  {
    q: 'สภาพสินค้าเป็นยังไง?',
    a: 'มือ 1-2 ส่วนใหญ่อยู่ในสภาพดีมาก บางชิ้นอาจมีรอยการใช้งานเล็กน้อย จะระบุไว้ในรายละเอียดสินค้าทุกครั้ง',
  },
  {
    q: 'คืนสินค้าได้ไหม?',
    a: 'เนื่องจากเป็นสินค้ามือสอง ไม่รับคืนหลังจากรับสินค้าแล้ว แนะนำให้ถามรายละเอียดให้ชัดเจนก่อนโอนเงิน',
  },
  {
    q: 'จัดส่งได้ทั่วไทยไหม?',
    a: 'ได้เลย ส่งทั่วประเทศ ค่าส่งคิดตามน้ำหนักจริง จะแจ้งราคาให้ก่อนโอนเงินเสมอ',
  },
];

export default function HowToOrderPage() {
  return (
    <>
      <Navbar />
      <main style={{ padding: '48px 0 80px' }}>
        <div className="container" style={{ maxWidth: '680px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{ fontFamily: 'Prompt, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
              วิธีสั่งซื้อ
            </h1>
            <p style={{ color: 'var(--fg-muted)', fontFamily: 'Prompt, sans-serif', fontSize: '1rem', lineHeight: 1.6 }}>
              ง่ายมาก ไม่ซับซ้อน ทักมาถามก่อนได้เลยถ้าไม่แน่ใจ
            </p>
          </div>

          {/* Steps */}
          <div className="how-steps">
            {STEPS.map((step, i) => (
              <div key={i} className="how-step">
                <div className="how-step-num">{i + 1}</div>
                <div className="how-step-icon">
                  <Icon name={step.icon} size={22} />
                </div>
                <div className="how-step-body">
                  <h3 className="how-step-title">{step.title}</h3>
                  <p className="how-step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="how-cta-box">
            <div style={{ marginBottom: '16px' }}>
              <Icon name="instagram" size={28} style={{ color: '#cc2366' }} />
            </div>
            <h2 style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>
              พร้อมสั่งซื้อแล้ว?
            </h2>
            <p style={{ color: 'var(--fg-muted)', fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem', marginBottom: '20px' }}>
              ทักมาที่ Instagram ร้านได้เลย แอดมินตอบไว
            </p>
            <a
              href="https://www.instagram.com/sell_second_hand_clothes.th"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ig-hero"
              style={{ justifyContent: 'center' }}
            >
              <span className="btn-ig-icon"><Icon name="instagram" size={20} /></span>
              <span className="btn-ig-text">
                <span className="btn-ig-main">DM สั่งซื้อเลย</span>
                <span className="btn-ig-sub">@sell_second_hand_clothes.th</span>
              </span>
            </a>
          </div>

          {/* FAQ */}
          <div style={{ marginTop: '56px' }}>
            <h2 style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 700, fontSize: '1.2rem', marginBottom: '20px' }}>
              คำถามที่พบบ่อย
            </h2>
            <div className="faq-list">
              {FAQS.map((f, i) => (
                <div key={i} className="faq-item">
                  <div className="faq-q">
                    <Icon name="questionCircle" size={16} style={{ flexShrink: 0, opacity: 0.5 }} />
                    {f.q}
                  </div>
                  <p className="faq-a">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Back */}
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/" style={{
              fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem',
              color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px',
              textDecoration: 'none',
            }}>
              <Icon name="chevronRight" size={14} style={{ transform: 'rotate(180deg)' }} />
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
