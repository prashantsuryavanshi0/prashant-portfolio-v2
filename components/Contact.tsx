'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { PROFILE } from '@/lib/data'

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => el.classList.add('is-in'), delay); io.disconnect() }
    }, { threshold: 0.01 })
    io.observe(el)
    return () => io.disconnect()
  }, [delay])
  return ref
}

function usePrefersReducedMotion() {
  const [r, setR] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setR(mq.matches)
    mq.addEventListener('change', (e) => setR(e.matches))
  }, [])
  return r
}

/* ── Rotating CTA Orb ─────────────────────────────────────────────── */
function OrbCTA() {
  const orbRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return
    const orb = orbRef.current; if (!orb) return
    const rect = orb.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    orb.style.transform = `perspective(600px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`
  }, [reduced])

  const onLeave = useCallback(() => {
    const orb = orbRef.current; if (!orb) return
    orb.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)'
    orb.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)'
    setTimeout(() => { if (orb) orb.style.transition = '' }, 620)
  }, [])

  const SIZE = 180
  const R = 72

  return (
    <div
      ref={orbRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ position: 'relative', width: SIZE, height: SIZE, flexShrink: 0, willChange: 'transform', transformStyle: 'preserve-3d' }}
      className="orb-root"
    >
      {/* orbit ring */}
      <div aria-hidden style={{
        position: 'absolute', inset: -10, borderRadius: '50%',
        border: '1px solid rgba(124,140,255,0.18)',
        animation: reduced ? 'none' : 'orbRing 28s linear infinite',
      }} />

      {/* rotating text */}
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} aria-hidden
        style={{ position: 'absolute', inset: 0, animation: reduced ? 'none' : 'orbSpin 24s linear infinite' }}>
        <defs>
          <path id="cp" d={`M ${SIZE/2} ${SIZE/2} m -${R} 0 a ${R} ${R} 0 1 1 ${R*2} 0 a ${R} ${R} 0 1 1 -${R*2} 0`} />
        </defs>
        <text style={{ fontSize: 10, fontWeight: 700, fill: '#A5B4FC', letterSpacing: '0.2em' }}>
          <textPath href="#cp">LET&apos;S CONNECT · AVAILABLE FOR WORK · </textPath>
        </text>
      </svg>

      {/* center button */}
      <a href={`mailto:${PROFILE.email}`} aria-label="Email Prashant Aryan" className="orb-btn"
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 80, height: 80, borderRadius: '50%',
          background: '#F8FAFC',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#111A2E', fontSize: 24, textDecoration: 'none',
          boxShadow: '0 0 40px rgba(124,140,255,0.18), 0 4px 20px rgba(0,0,0,0.3)',
          transition: 'transform 0.35s cubic-bezier(0.23,1,0.32,1), box-shadow 0.35s ease',
        }}>↗</a>
    </div>
  )
}

/* ── main ─────────────────────────────────────────────────────────── */
export default function Contact() {
  const [copied, setCopied] = useState(false)
  const r1 = useReveal(0)
  const r2 = useReveal(120)
  const r3 = useReveal(240)
  const r4 = useReveal(360)
  const r5 = useReveal(480)
  const rFoot1 = useReveal(0)
  const rFoot2 = useReveal(100)

  const copy = () => {
    navigator.clipboard.writeText(PROFILE.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <section id="contact" style={{
      position: 'relative',
      background: 'linear-gradient(135deg, #111A2E 0%, #1B2947 100%)',
      padding: 'clamp(80px,14vh,160px) var(--gutter)',
      overflow: 'hidden',
    }}>

      {/* ambient glows */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="ct-g1" style={{ position: 'absolute', top: '-10%', left: '25%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,140,255,0.13) 0%, transparent 65%)' }} />
        <div className="ct-g2" style={{ position: 'absolute', bottom: '-5%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,140,255,0.08) 0%, transparent 65%)' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* label */}
        <div ref={r1} className="rv">
          <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.3em', color: '#A5B4FC', textTransform: 'uppercase', fontWeight: 600, marginBottom: '1.25rem' }}>
            06 — Contact
          </p>
        </div>

        {/* heading */}
        <div ref={r2} className="rv" style={{ marginBottom: '3.5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-inter), system-ui',
            fontSize: 'clamp(2.8rem, 7.5vw, 7.5rem)',
            fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.95,
            color: '#F8FAFC', margin: 0,
          }}>
            Let&apos;s build<br />
            something{' '}
            <em className="ct-together" style={{ fontStyle: 'italic', fontWeight: 300, color: '#A5B4FC', letterSpacing: '-0.02em', cursor: 'default' }}>
              together.
            </em>
          </h2>
        </div>

        {/* email */}
        <div ref={r3} className="rv" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <a href={`mailto:${PROFILE.email}`} className="ct-email"
            style={{ fontSize: 'clamp(0.85rem,1.8vw,1.1rem)', fontWeight: 700, color: '#FFFFFF', textDecoration: 'none', borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: 2, transition: 'border-color 0.25s' }}>
            {PROFILE.email}
          </a>
          <button onClick={copy} aria-live="polite" style={{
            padding: '5px 16px', borderRadius: 999, cursor: 'pointer',
            background: copied ? 'rgba(124,140,255,0.25)' : 'rgba(255,255,255,0.06)',
            border: copied ? '1.5px solid rgba(124,140,255,0.5)' : '1.5px solid rgba(255,255,255,0.16)',
            color: '#F8FAFC', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
            transition: 'all 0.22s ease',
          }}>
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>

        {/* links */}
        <div ref={r4} className="rv" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.75rem', marginBottom: '5rem' }}>
          {[
            { href: PROFILE.phoneHref, label: PROFILE.phone },
            { href: PROFILE.github, label: 'GitHub ↗', ext: true },
            { href: PROFILE.linkedin, label: 'LinkedIn ↗', ext: true },
          ].map(({ href, label, ext }) => (
            <a key={label} href={href} className="ct-link"
              {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              style={{ fontSize: 14, fontWeight: 600, color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.22s, transform 0.22s', display: 'inline-block' }}>
              {label}
            </a>
          ))}
        </div>

        {/* bottom bar */}
        <div ref={r5} className="rv" style={{
          borderTop: '1px solid rgba(255,255,255,0.10)',
          paddingTop: '2.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '2rem',
        }}>
          <div ref={rFoot1} className="rv">
            <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'monospace', letterSpacing: '0.06em' }}>
              © 2026 Prashant Aryan
            </p>
          </div>

          <OrbCTA />

          <div ref={rFoot2} className="rv">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="ct-top"
              style={{ fontSize: 12, color: '#CBD5E1', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.22s' }}>
              <span className="ct-arrow" style={{ display: 'inline-block', transition: 'transform 0.25s', color: '#A5B4FC' }}>↑</span>
              Back to top
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbSpin { to { transform: rotate(360deg); } }
        @keyframes orbRing { to { transform: rotate(-360deg); } }
        @keyframes ctG1 { 0%,100%{transform:translate(0,0)scale(1)}50%{transform:translate(40px,-30px)scale(1.08)} }
        @keyframes ctG2 { 0%,100%{transform:translate(0,0)scale(1)}50%{transform:translate(-30px,20px)scale(1.06)} }
        .ct-g1 { animation: ctG1 22s ease-in-out infinite; }
        .ct-g2 { animation: ctG2 18s ease-in-out infinite; }
        .ct-together:hover { color: #7C8CFF !important; letter-spacing: 0.01em !important; }
        .ct-email:hover { border-color: #A5B4FC !important; }
        .ct-link:hover { color: #FFFFFF !important; transform: translateY(-2px); }
        .orb-btn:hover {
          transform: translate(-50%,-50%) scale(1.08) translateY(-2px) !important;
          box-shadow: 0 0 60px rgba(124,140,255,0.35), 0 8px 28px rgba(0,0,0,0.4) !important;
        }
        .ct-top:hover { color: #FFFFFF !important; }
        .ct-top:hover .ct-arrow { transform: translateY(-3px); }
        @media (max-width:600px) {
          .orb-root { width:140px!important; height:140px!important; }
          .orb-root svg { width:140px!important; height:140px!important; }
          .orb-btn { width:62px!important; height:62px!important; font-size:18px!important; }
        }
        @media (prefers-reduced-motion:reduce) {
          .ct-g1,.ct-g2 { animation:none; }
          .orb-root svg,.orb-root>div:first-child { animation:none!important; }
        }
      `}</style>
    </section>
  )
}
