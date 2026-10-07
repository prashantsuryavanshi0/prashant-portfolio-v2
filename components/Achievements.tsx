'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { ACHIEVEMENTS, CERTIFICATIONS } from '@/lib/data'

/* ── hooks ─────────────────────────────────────────────────────────── */

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
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

/* ── CountUp ────────────────────────────────────────────────────────── */
function CountUp({ target, unit }: { target: number; unit: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const dur = 1400
        const ease = (t: number) => 1 - Math.pow(1 - t, 4)
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur)
          setVal(Math.round(ease(p) * target))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        io.disconnect()
      }
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [target])
  return <span ref={ref}>{val}{unit}</span>
}

/* ── 3D card ────────────────────────────────────────────────────────── */
function Card3D({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const revealRef = useReveal(delay)

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return
    const card = ref.current; if (!card) return
    const rect = card.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    card.style.transform = `perspective(900px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg) scale(1.015) translateY(-4px)`
    if (glareRef.current) {
      const gx = ((e.clientX - rect.left) / rect.width) * 100
      const gy = ((e.clientY - rect.top) / rect.height) * 100
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(165,180,252,0.12) 0%, transparent 55%)`
    }
  }, [reduced])

  const onLeave = useCallback(() => {
    const card = ref.current; if (!card) return
    card.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.55s ease'
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1) translateY(0)'
    if (glareRef.current) glareRef.current.style.background = 'transparent'
    setTimeout(() => { if (card) card.style.transition = 'transform 0.12s ease, box-shadow 0.12s ease' }, 580)
  }, [])

  const onEnter = useCallback(() => {
    const card = ref.current; if (!card) return
    card.style.transition = 'transform 0.12s ease, box-shadow 0.12s ease'
  }, [])

  // merge reveal ref + card ref
  const setRefs = useCallback((el: HTMLDivElement | null) => {
    (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    (revealRef as React.MutableRefObject<HTMLDivElement | null>).current = el
  }, [revealRef])

  return (
    <div
      ref={setRefs}
      className="rv ach-card"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onEnter}
      style={{
        position: 'relative',
        borderRadius: 26,
        background: 'linear-gradient(135deg, #172033 0%, #202B44 100%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 4px 32px rgba(20,30,55,0.18)',
        overflow: 'hidden',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* glare overlay */}
      <div ref={glareRef} aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 26, pointerEvents: 'none', zIndex: 10, transition: 'background 0.1s' }} />
      {children}
    </div>
  )
}

/* ── AchievCard ─────────────────────────────────────────────────────── */
function AchievCard({ a, i, delay }: {
  a: { id: string; title: string; platform: string; detail: string; number: string; unit: string }
  i: number
  delay: number
}) {
  return (
    <Card3D delay={delay}>
      <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', minHeight: 240, position: 'relative', zIndex: 2 }}>

        {/* Top row: badge + counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: 'rgba(124,140,255,0.15)',
            border: '1px solid rgba(165,180,252,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 900, color: '#A5B4FC',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2) inset',
            transition: 'transform 0.35s ease',
          }}
          className="ach-badge"
          >
            {a.platform[0]}
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#4a6080', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {String(i + 1).padStart(2, '0')} / 0{ACHIEVEMENTS.length}
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <p style={{ fontFamily: 'monospace', fontSize: 9, color: '#94A3B8', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{a.platform}</p>
          <p style={{ fontSize: 15, fontWeight: 800, color: '#F8FAFC', lineHeight: 1.3, letterSpacing: '-0.02em' }}>{a.title}</p>
          <p style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.55 }}>{a.detail}</p>
        </div>

        {/* Decorative value — fully inside card, no clipping */}
        <div style={{
          position: 'absolute', bottom: 10, right: 14,
          fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, lineHeight: 1,
          color: 'rgba(255,255,255,0.10)',
          fontFamily: 'var(--font-inter), system-ui',
          letterSpacing: '-0.04em',
          whiteSpace: 'nowrap',
          pointerEvents: 'none', userSelect: 'none',
          zIndex: 1,
          transition: 'color 0.35s ease',
        }} className="ach-deco">
          <CountUp target={parseInt(a.number)} unit={a.unit} />
        </div>

      </div>
    </Card3D>
  )
}

/* ── CertCard ───────────────────────────────────────────────────────── */
function CertCard({ c, delay }: { c: { id: string; title: string; issuer: string; year: string }; delay: number }) {
  return (
    <Card3D delay={delay}>
      <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', minHeight: 240, position: 'relative', zIndex: 2 }}>

        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: 'rgba(124,140,255,0.15)',
            border: '1px solid rgba(165,180,252,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 900, color: '#A5B4FC',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2) inset',
          }}>
            ✦
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#4a6080', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            CERT
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <p style={{ fontFamily: 'monospace', fontSize: 9, color: '#94A3B8', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Certification</p>
          <p style={{ fontSize: 15, fontWeight: 800, color: '#F8FAFC', lineHeight: 1.3, letterSpacing: '-0.02em' }}>{c.title}</p>
          <p style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.55 }}>{c.issuer} · {c.year}</p>
        </div>

        {/* Decorative */}
        <div style={{
          position: 'absolute', bottom: 10, right: 14,
          fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, lineHeight: 1,
          color: 'rgba(255,255,255,0.10)',
          fontFamily: 'monospace',
          pointerEvents: 'none', userSelect: 'none', zIndex: 1,
          letterSpacing: '-0.04em',
          whiteSpace: 'nowrap',
        }} className="ach-deco">
          AWS
        </div>

      </div>
    </Card3D>
  )
}

/* ── Main component ─────────────────────────────────────────────────── */
export default function Achievements() {
  const r1 = useReveal(0)
  const r2 = useReveal(80)
  const r3 = useReveal(560)

  return (
    <section id="achievements" style={{ position: 'relative', background: '#F4F6FA', padding: 'clamp(80px,14vh,140px) var(--gutter)', overflow: 'hidden' }}>

      {/* Background blobs */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-5%', left: '20%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,140,255,0.06) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,140,255,0.05) 0%, transparent 70%)' }} />
      </div>

      <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Label */}
        <div ref={r1} className="rv" style={{ marginBottom: '1rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.3em', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>
            05 — Achievements
          </p>
        </div>

        {/* Heading */}
        <div ref={r2} className="rv" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--font-inter), system-ui', fontSize: 'clamp(2.4rem,5vw,4.2rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.97, color: '#172033', margin: 0 }}>
            Milestones &amp;<br />
            <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#94A3B8', letterSpacing: '-0.02em' }}>recognition.</em>
          </h2>
        </div>

        {/* Achievement cards — 3 col */}
        <div className="ach-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.25rem' }}>
          {ACHIEVEMENTS.map((a, i) => (
            <AchievCard key={a.id} a={a} i={i} delay={160 + i * 100} />
          ))}
        </div>

        {/* Certification row — intentional 1/3 width left-aligned */}
        <div className="ach-cert-row" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', alignItems: 'stretch' }}>
          {CERTIFICATIONS.map((c, i) => (
            <CertCard key={c.id} c={c} delay={460 + i * 100} />
          ))}
          {/* Intentional space filler — subtle "open for opportunities" hint */}
          <div ref={r3} className="rv ach-open-card" style={{
            borderRadius: 26, border: '1.5px dashed rgba(124,140,255,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', gap: '0.75rem', flexDirection: 'column',
            background: 'rgba(124,140,255,0.03)',
            minHeight: 140,
          }}>
            <p style={{ fontFamily: 'monospace', fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.18em', textAlign: 'center' }}>More to come</p>
            <p style={{ fontSize: 13, color: '#CBD5E1', textAlign: 'center', lineHeight: 1.6, maxWidth: 240 }}>
              Continuously learning and earning new certifications.
            </p>
          </div>
        </div>

      </div>

      <style>{`
        .ach-card:hover .ach-badge { transform: scale(1.08); }
        .ach-card:hover .ach-deco  { color: rgba(255,255,255,0.16); }
        .ach-card:hover { box-shadow: 0 12px 56px rgba(20,30,55,0.28) !important; }
        @media (max-width: 900px) {
          .ach-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .ach-cert-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 580px) {
          .ach-grid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ach-card { transition: none !important; }
        }
      `}</style>
    </section>
  )
}
