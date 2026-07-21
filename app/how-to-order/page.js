'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Icon from '@/components/Icon';
import Link from 'next/link';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { FadeInUp, ScrollReveal, StaggerContainer, StaggerItem } from '@/components/MotionWrapper';

const STEPS = [
  {
    icon: 'eye',
    title: 'เลือกสินค้าที่สนใจ',
    desc: 'ดูสินค้าในหน้าหลัก กดเข้าดูรายละเอียดได้เลย ถ้าชอบตัวไหนกดใส่ตะกร้าเพื่อสรุปรายการ',
    color: '#007aff',
  },
  {
    icon: 'instagram',
    title: 'DM มาที่ Instagram ร้าน',
    desc: 'ทักมาที่ @ บอกรหัสสินค้า (เช่น S1, S5) หรือแนบรูปสินค้าที่สนใจ',
    color: '#cc2366',
  },
  {
    icon: 'chatBubble',
    title: 'นัดราคาและยืนยันออเดอร์',
    desc: 'แอดมินจะตอบกลับและยืนยันว่าสินค้ายังว่างอยู่ สอบถามรายละเอียดเพิ่มเติมได้เลย',
    color: '#34c759',
  },
  {
    icon: 'creditCard',
    title: 'ชำระเงิน',
    desc: 'โอนเงินผ่านพร้อมเพย์หรือบัญชีธนาคาร แอดมินจะแจ้งข้อมูลให้ทาง DM',
    color: '#ff9500',
  },
  {
    icon: 'truck',
    title: 'จัดส่งสินค้า',
    desc: 'ส่งพัสดุผ่าน Kerry หรือ Flash — แอดมินจะส่งเลขพัสดุให้ทาง DM หลังโอนเงินแล้ว',
    color: '#5856d6',
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
  {
    q: 'มีสินค้าเข้าใหม่บ่อยไหม?',
    a: 'เข้าใหม่เกือบทุกสัปดาห์ ติดตามได้ที่ Instagram ร้านเพื่อไม่พลาดสินค้าใหม่',
  },
  {
    q: 'เลือกไซส์ยังไง?',
    a: 'สามารถดูคู่มือไซส์ได้ในหน้ารายละเอียดสินค้า หรือทักมาถามแอดมินได้เลย',
  },
];

export default function HowToOrderPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const { settings } = useSiteSettings();

  return (
    <>
      <Navbar />
      <main style={{ padding: '48px 0 80px' }}>
        <div className="container" style={{ maxWidth: '720px' }}>

          {/* Header */}
          <FadeInUp>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <motion.div
                style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #cc2366, #f09433)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(204, 35, 102, 0.3)',
                }}
                whileHover={{ scale: 1.1, rotate: 10 }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Icon name="bag" size={28} style={{ color: '#fff' }} />
              </motion.div>
              <h1 style={{ fontFamily: 'Prompt, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
                วิธีสั่งซื้อ
              </h1>
              <p style={{ color: 'var(--fg-muted)', fontFamily: 'Prompt, sans-serif', fontSize: '1rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto' }}>
                ง่ายมาก ไม่ซับซ้อน ทักมาถามก่อนได้เลยถ้าไม่แน่ใจ
              </p>
            </div>
          </FadeInUp>

          {/* Steps */}
          <StaggerContainer className="how-steps">
            {STEPS.map((step, i) => (
              <StaggerItem key={i}>
                <motion.div
                  className="how-step"
                  whileHover={{ x: 8, background: 'var(--bg-secondary)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="how-step-num"
                    style={{ background: step.color }}
                    whileHover={{ scale: 1.15, rotate: 360 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    {i + 1}
                  </motion.div>
                  <motion.div
                    className="how-step-icon"
                    style={{ borderColor: `${step.color}30`, color: step.color }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon name={step.icon} size={22} />
                  </motion.div>
                  <div className="how-step-body">
                    <h3 className="how-step-title">{step.title}</h3>
                    <p className="how-step-desc">{step.desc}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* CTA Box */}
          <ScrollReveal>
            <motion.div
              className="how-cta-box"
              style={{
                background: 'linear-gradient(135deg, rgba(204, 35, 102, 0.08), rgba(240, 148, 51, 0.08))',
                border: '1px solid rgba(204, 35, 102, 0.2)',
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(204, 35, 102, 0.15)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <motion.div
                style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', boxShadow: '0 6px 20px rgba(204, 35, 102, 0.35)',
                }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Icon name="instagram" size={26} style={{ color: '#fff' }} />
              </motion.div>
              <h2 style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 700, fontSize: '1.2rem', marginBottom: '8px' }}>
                พร้อมสั่งซื้อแล้ว?
              </h2>
              <p style={{ color: 'var(--fg-muted)', fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem', marginBottom: '20px' }}>
                ทักมาที่ Instagram ร้านได้เลย แอดมินตอบไว
              </p>
              <motion.a
                href={`https://www.instagram.com/${settings.igUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ig-hero"
                style={{ justifyContent: 'center' }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="btn-ig-icon"><Icon name="instagram" size={20} /></span>
                <span className="btn-ig-text">
                  <span className="btn-ig-main">{settings.igCtaText}</span>
                  <span className="btn-ig-sub">@{settings.igUsername}</span>
                </span>
              </motion.a>
            </motion.div>
          </ScrollReveal>

          {/* FAQ */}
          <ScrollReveal delay={0.2}>
            <div style={{ marginTop: '56px' }}>
              <h2 style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 700, fontSize: '1.2rem', marginBottom: '20px' }}>
                คำถามที่พบบ่อย
              </h2>
              <div className="faq-list">
                {FAQS.map((f, i) => (
                  <motion.div
                    key={i}
                    className={`faq-item ${openFaq === i ? 'open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    whileHover={{ background: 'var(--bg-secondary)' }}
                  >
                    <div className="faq-q" style={{ marginBottom: openFaq === i ? '8px' : 0 }}>
                      <Icon name="questionCircle" size={16} style={{ flexShrink: 0, opacity: 0.5 }} />
                      <span style={{ flex: 1 }}>{f.q}</span>
                      <motion.div
                        animate={{ rotate: openFaq === i ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon name="chevronRight" size={14} style={{ opacity: 0.4 }} />
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <p className="faq-a">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Back */}
          <FadeInUp delay={0.4}>
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/" style={{
                  fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem',
                  color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px',
                  textDecoration: 'none', transition: 'color 0.2s ease',
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
