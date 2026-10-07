'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { PROJECTS } from '@/lib/data'

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => el.classList.add('is-in'), delay); io.disconnect() }
    }, { threshold: 0.08 })
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

const TECH_COLORS: Record<string, string> = {
  'React.js': '#61dafb', 'Node.js': '#3c873a', 'MongoDB': '#47a248',
  'PostgreSQL': '#336791', 'Express.js': '#9ca3af', 'Tailwind CSS': '#06b6d4',
  'JavaScript': '#f0c040', 'HTML': '#e34c26', 'CSS': '#264de4',
  'Vite': '#818cf8', 'Redux Toolkit': '#a78bfa', 'Axios': '#818cf8',
  'REST APIs': '#fb923c',
}

export default function Work() {
  const [active, setActive] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  const r1 = useReveal(0)
  const r2 = useReveal(100)
  const r3 = useReveal(220)

  const p = PROJECTS[active]
  const go = (idx: number) => { setActive(idx); setAnimKey(k => k + 1) }

  // 3D tilt
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    const rx = -dy * 2
    const ry = dx * 2
    card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`
    if (glareRef.current) {
      const gx = ((e.clientX - rect.left) / rect.width) * 100
      const gy = ((e.clientY - rect.top) / rect.height) * 100
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(165,180,252,0.08) 0%, transparent 65%)`
    }
  }, [reduced])

  const onMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)'
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)'
    if (glareRef.current) glareRef.current.style.background = 'transparent'
    setTimeout(() => { if (card) card.style.transition = 'transform 0.12s ease' }, 620)
  }, [])

  const onMouseEnter = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.transition = 'transform 0.12s ease'
  }, [])

  return (
    <section id="work" style={{ position: 'relative', background: '#F4F6FA', padding: 'clamp(80px,12vh,120px) var(--gutter)', overflow: 'hidden' }}>

      {/* Subtle background blobs */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,140,255,0.07) 0%, transparent 70%)', filter: 'blur(2px)' }} />
        <div style={{ position: 'absolute', bottom: '-8%', left: '-5%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,140,255,0.05) 0%, transparent 70%)' }} />
      </div>

      <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Heading */}
        <div ref={r1} className="rv" style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', marginBottom: '0.6rem', fontWeight: 600 }}>
            03 — Selected Work
          </p>
          <h2 style={{ fontFamily: 'var(--font-inter), system-ui', fontSize: 'clamp(2.6rem,5.5vw,4.8rem)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.97, color: '#172033', margin: 0 }}>
            Things I&apos;ve<br />
            <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#aaa', letterSpacing: '-0.02em' }}>built.</em>
          </h2>
        </div>

        {/* Tab nav */}
        <div ref={r2} className="rv" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
          {PROJECTS.map((proj, i) => (
            <button key={proj.id} onClick={() => go(i)} style={{
              padding: '7px 16px', borderRadius: 999, fontSize: 11, fontWeight: 700, cursor: 'pointer',
              background: active === i ? '#172033' : 'transparent',
              color: active === i ? '#fff' : '#64748b',
              border: active === i ? '1.5px solid #172033' : '1.5px solid #CBD5E1',
              boxShadow: active === i ? '0 2px 12px rgba(23,32,51,0.22)' : 'none',
              transition: 'all 0.22s cubic-bezier(0.23,1,0.32,1)',
              transform: 'translateY(0)',
            }}
            onMouseEnter={e => { if (active !== i) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; if (active !== i) (e.currentTarget as HTMLButtonElement).style.borderColor = '#94A3B8' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; if (active !== i) (e.currentTarget as HTMLButtonElement).style.borderColor = '#CBD5E1' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 9, opacity: 0.5, marginRight: 5 }}>{proj.index}</span>
              {proj.title.split(' ').slice(0, 2).join(' ')}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 10, color: '#94A3B8', letterSpacing: '0.12em' }}>{active + 1} / {PROJECTS.length}</span>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 5, marginBottom: '1.5rem' }}>
          {PROJECTS.map((_, i) => (
            <div key={i} onClick={() => go(i)} style={{ height: 3, borderRadius: 999, width: i === active ? 28 : 5, background: i === active ? '#172033' : '#CBD5E1', transition: 'all 0.32s cubic-bezier(0.23,1,0.32,1)', cursor: 'pointer' }} />
          ))}
        </div>

        {/* ── DARK SHOWCASE CARD ── */}
        <div ref={r3} className="rv">
          <div
            key={animKey}
            ref={cardRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
            className="wk-card-grid"
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '1fr 1.15fr',
              borderRadius: 32,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #172033 0%, #202B44 100%)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 8px 64px rgba(23,32,51,0.35), 0 2px 0 inset rgba(255,255,255,0.05)',
              animation: 'wkFade 0.38s cubic-bezier(0.23,1,0.32,1) both',
              willChange: 'transform',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Mouse glare overlay */}
            <div ref={glareRef} aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 32, pointerEvents: 'none', zIndex: 20, transition: 'background 0.1s' }} />

            {/* LEFT — info */}
            <div style={{
              padding: 'clamp(2rem, 3.2vw, 2.8rem)',
              display: 'flex', flexDirection: 'column', gap: '1.1rem',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              position: 'relative', zIndex: 2,
            }}>
              {/* Badge + kicker */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#A5B4FC', background: 'rgba(124,140,255,0.15)', border: '1px solid rgba(124,140,255,0.25)', padding: '3px 10px', borderRadius: 999, letterSpacing: '0.08em', fontWeight: 700 }}>{p.index}</span>
                <span style={{ fontSize: 9, color: '#94A3B8', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700 }}>{p.kicker}</span>
              </div>

              {/* Title */}
              <h3 style={{ fontFamily: 'var(--font-inter), system-ui', fontSize: 'clamp(1.45rem, 2.4vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.045em', lineHeight: 1.08, color: '#F8FAFC', margin: 0 }}>
                {p.title}
              </h3>

              {/* Description */}
              <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.85, margin: 0, maxWidth: '38ch' }}>{p.description}</p>

              {/* Features */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: '#94A3B8', lineHeight: 1.5 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#7C8CFF', opacity: 0.5, flexShrink: 0, marginTop: 4 }} />
                    {f}
                  </div>
                ))}
              </div>

              {/* Tech pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {p.tech.map(t => (
                  <span key={t} style={{
                    padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                    background: `${TECH_COLORS[t] || '#7C8CFF'}18`,
                    color: TECH_COLORS[t] || '#A5B4FC',
                    border: `1px solid ${TECH_COLORS[t] || '#7C8CFF'}30`,
                    backdropFilter: 'blur(4px)',
                  }}>{t}</span>
                ))}
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '0.5rem' }}>
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer"
                    className="wk-demo-btn"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '0.65rem 1.5rem', borderRadius: 999, background: '#F8FAFC', color: '#172033', fontSize: 12, fontWeight: 800, textDecoration: 'none', boxShadow: '0 2px 20px rgba(23,32,51,0.35)', transition: 'all 0.28s cubic-bezier(0.23,1,0.32,1)', letterSpacing: '0.01em' }}>
                    Live Demo
                    <span className="wk-arrow" style={{ display: 'inline-block', transition: 'transform 0.28s cubic-bezier(0.23,1,0.32,1)' }}>{'↗'}</span>
                  </a>
                )}
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '0.65rem 1.5rem', borderRadius: 999, border: '1.5px solid rgba(165,180,252,0.22)', color: '#A5B4FC', fontSize: 12, fontWeight: 600, textDecoration: 'none', transition: 'all 0.22s ease' }}>
                    {'GitHub ↗'}
                  </a>
                )}
              </div>
            </div>

            {/* RIGHT — screenshot */}
            <div style={{
              position: 'relative', zIndex: 2,
              background: 'linear-gradient(160deg, #1e2d47 0%, #101827 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 'clamp(1.5rem, 3vw, 2.5rem)',
              overflow: 'hidden',
            }}>
              {/* Subtle corner glow */}
              <div aria-hidden style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,140,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

              {p.image && (
                <div className="wk-img-wrap" style={{
                  width: '100%',
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '1px solid rgba(165,180,252,0.12)',
                  boxShadow: '0 8px 48px rgba(16,24,39,0.6)',
                  transition: 'transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s ease',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.title}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prev / Next */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
          <button onClick={() => go(Math.max(0, active - 1))} disabled={active === 0}
            style={{ width: 40, height: 40, borderRadius: '50%', border: '1.5px solid #CBD5E1', background: 'transparent', cursor: active === 0 ? 'not-allowed' : 'pointer', fontSize: 16, opacity: active === 0 ? 0.3 : 1, transition: 'all 0.2s', color: '#172033' }}>←</button>
          <button onClick={() => go(Math.min(PROJECTS.length - 1, active + 1))} disabled={active === PROJECTS.length - 1}
            style={{ width: 40, height: 40, borderRadius: '50%', border: '1.5px solid #172033', background: active === PROJECTS.length - 1 ? 'transparent' : '#172033', color: active === PROJECTS.length - 1 ? '#172033' : '#F8FAFC', cursor: active === PROJECTS.length - 1 ? 'not-allowed' : 'pointer', fontSize: 16, opacity: active === PROJECTS.length - 1 ? 0.3 : 1, transition: 'all 0.2s' }}>→</button>
        </div>

      </div>

      <style>{`
        @keyframes wkFade {
          from { opacity: 0; transform: perspective(1200px) translateY(14px); }
          to   { opacity: 1; transform: perspective(1200px) translateY(0); }
        }
        .wk-demo-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(23,32,51,0.45);
        }
        .wk-demo-btn:hover .wk-arrow {
          transform: translate(2px, -2px);
        }
        .wk-img-wrap:hover {
          transform: scale(1.015);
          box-shadow: 0 16px 64px rgba(16,24,39,0.75);
        }
        @media (max-width: 768px) {
          .wk-card-grid { grid-template-columns: 1fr !important; }
          .wk-card-grid > div:first-child { padding: 1.5rem !important; }
        }
        @media (max-width: 480px) {
          .wk-card-grid { border-radius: 20px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wk-demo-btn:hover { transform: none; }
          .wk-img-wrap:hover { transform: none; }
        }
      `}</style>
    </section>
  )
}
