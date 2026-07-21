'use client';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Icon from '@/components/Icon';
import Link from 'next/link';
import { FadeInUp, ScrollReveal, StaggerContainer, StaggerItem } from '@/components/MotionWrapper';

const VALUES = [
  {
    icon: 'badgeCheck',
    title: 'ของแท้ 100%',
    desc: 'ทุกชิ้นมีที่มาชัดเจน เราคัดสรรเฉพาะสินค้าแบรนด์เนมของแท้เท่านั้น',
    color: '#34c759',
  },
  {
    icon: 'tag',
    title: 'ราคาเป็นกันเอง',
    desc: 'ราคาดีกว่าซื้อใหม่หลายเท่า คุณภาพเท่ากัน แต่ประหยัดกว่า',
    color: '#007aff',
  },
  {
    icon: 'eye',
    title: 'คัดสรรอย่างพิถีพิถัน',
    desc: 'ทุกชิ้นผ่านการตรวจสอบสภาพก่อนขาย ระบุตำหนิอย่างชัดเจน',
    color: '#ff9500',
  },
  {
    icon: 'truck',
    title: 'จัดส่งทั่วไทย',
    desc: 'ส่งพัสดุทั่วประเทศ เลข跟踪 ตรวจสอบได้ทุกขั้นตอน',
    color: '#5856d6',
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ padding: '48px 0 80px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>

          {/* Header */}
          <FadeInUp>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <motion.div
                style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #cc2366, #f09433)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(204, 35, 102, 0.3)',
                }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Icon name="shirt" size={32} style={{ color: '#fff' }} />
              </motion.div>
              <h1 style={{ fontFamily: 'Prompt, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
                เกี่ยวกับเรา
              </h1>
              <p style={{ color: 'var(--fg-muted)', fontFamily: 'Prompt, sans-serif', fontSize: '1rem', lineHeight: 1.8, maxWidth: '560px', margin: '0 auto' }}>
                Su Sell Second hand ร้านเสื้อผ้ามือสองแบรนด์เนมของแท้
                คัดสรรมาอย่างดี พร้อมบริการที่เป็นกันเอง
              </p>
            </div>
          </FadeInUp>

          {/* Story */}
          <ScrollReveal>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              marginBottom: '48px',
              border: '1px solid var(--border)',
            }}>
              <h2 style={{ fontFamily: 'Prompt, sans-serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
                ทำไมต้อง Su Sell?
              </h2>
              <p style={{
                fontFamily: 'Prompt, sans-serif',
                fontSize: '0.95rem',
                color: 'var(--fg-secondary)',
                lineHeight: 1.8,
                marginBottom: '16px',
              }}>
                เราเชื่อว่าเสื้อผ้าแบรนด์เนมไม่จำเป็นต้องราคาแพงเสมอไป
                สินค้ามือสองคุณภาพดี ราคาเป็นกันเอง ช่วยให้ทุกคนเข้าถึงแบรนด์ที่รักได้
              </p>
              <p style={{
                fontFamily: 'Prompt, sans-serif',
                fontSize: '0.95rem',
                color: 'var(--fg-secondary)',
                lineHeight: 1.8,
              }}>
                ทุกชิ้นผ่านการตรวจสอบอย่างละเอียด เราบอกรายละเอียดและตำหนิอย่างชัดเจน
                เพื่อให้ลูกค้ามั่นใจว่าจะได้รับสินค้าที่ตรงตามความคาดหวัง
              </p>
            </div>
          </ScrollReveal>

          {/* Values */}
          <ScrollReveal>
            <h2 style={{ fontFamily: 'Prompt, sans-serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
              คุณค่าที่เรายึดมั่น
            </h2>
          </ScrollReveal>

          <StaggerContainer style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '48px',
          }}>
            {VALUES.map((value, i) => (
              <StaggerItem key={i}>
                <motion.div
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    textAlign: 'center',
                    height: '100%',
                  }}
                  whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: `${value.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 12px', color: value.color,
                    }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <Icon name={value.icon} size={24} />
                  </motion.div>
                  <h3 style={{ fontFamily: 'Prompt, sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>
                    {value.title}
                  </h3>
                  <p style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.85rem', color: 'var(--fg-muted)', lineHeight: 1.6 }}>
                    {value.desc}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Shipping Info */}
          <ScrollReveal>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              marginBottom: '48px',
              border: '1px solid var(--border)',
            }}>
              <h2 style={{ fontFamily: 'Prompt, sans-serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="truck" size={20} />
                ข้อมูลการจัดส่ง
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
              }}>
                <div>
                  <h4 style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>
                    บริษัทขนส่ง
                  </h4>
                  <ul style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.85rem', color: 'var(--fg-secondary)', lineHeight: 1.8, paddingLeft: '20px' }}>
                    <li>Kerry Express</li>
                    <li>Flash Express</li>
                    <li>Thailand Post</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>
                    ค่าส่ง
                  </h4>
                  <ul style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.85rem', color: 'var(--fg-secondary)', lineHeight: 1.8, paddingLeft: '20px' }}>
                    <li>กรุงเทพ: 35-50 บาท</li>
                    <li>ต่างจังหวัด: 50-80 บาท</li>
                    <li>/free shipping สำหรับยอดสั่งซื้อ 1,000 บาทขึ้นไป</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>
                    เวลาจัดส่ง
                  </h4>
                  <ul style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.85rem', color: 'var(--fg-secondary)', lineHeight: 1.8, paddingLeft: '20px' }}>
                    <li>กรุงเทพ: 1-2 วัน</li>
                    <li>ต่างจังหวัด: 2-3 วัน</li>
                    <li>หลังโอนเงินยืนยัน</li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Payment Methods */}
          <ScrollReveal>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              marginBottom: '48px',
              border: '1px solid var(--border)',
            }}>
              <h2 style={{ fontFamily: 'Prompt, sans-serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="creditCard" size={20} />
                ช่องทางชำระเงิน
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
              }}>
                {[
                  { name: 'PromptPay', desc: 'โอนผ่าน QR Code' },
                  { name: 'bank transfer', desc: 'โอนผ่านบัญชีธนาคาร' },
                  { name: 'TrueMoney Wallet', desc: 'กระเป๋าเงินออนไลน์' },
                ].map((method, i) => (
                  <motion.div
                    key={i}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Icon name="check" size={16} style={{ color: '#34c759', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem', fontWeight: 600 }}>
                        {method.name}
                      </p>
                      <p style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.75rem', color: 'var(--fg-muted)' }}>
                        {method.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Contact */}
          <ScrollReveal>
            <div style={{
              background: 'linear-gradient(135deg, rgba(204, 35, 102, 0.08), rgba(240, 148, 51, 0.08))',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              textAlign: 'center',
              border: '1px solid rgba(204, 35, 102, 0.2)',
            }}>
              <h2 style={{ fontFamily: 'Prompt, sans-serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>
                ติดต่อเรา
              </h2>
              <p style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem', color: 'var(--fg-muted)', marginBottom: '20px' }}>
                มีคำถามหรือต้องการสอบถามเพิ่มเติม? ทักมาได้เลย!
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.a
                  href="https://www.instagram.com/sell_second_hand_clothes.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ gap: '8px', fontFamily: 'Prompt, sans-serif' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon name="instagram" size={18} />
                  Instagram
                </motion.a>
                <motion.a
                  href="https://line.me/ti/p/~@sellsecondhand"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ gap: '8px', fontFamily: 'Prompt, sans-serif', borderColor: '#06c755', color: '#06c755' }}
                  whileHover={{ scale: 1.05, background: '#06c755', color: '#fff' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon name="line" size={18} />
                  LINE
                </motion.a>
              </div>
            </div>
          </ScrollReveal>

          {/* Back */}
          <FadeInUp delay={0.3}>
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/" style={{
                  fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem',
                  color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px',
                  textDecoration: 'none',
                }}>
                  <Icon name="chevronRight" size={14} style={{ transform: 'rotate(180deg)' }} />
                  กลับหน้าหลัก
                </Link>
              </motion.div>
            </div>
          </FadeInUp>
        </div>
      </main>
    </>
  );
}
