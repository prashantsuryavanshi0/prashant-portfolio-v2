'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

/* ─── data ────────────────────────────────────────────────────────── */
const ITEMS = [
  {
    id: 'nims',
    type: 'edu' as const,
    period: '2022 — 2026',
    tag: 'Education',
    title: 'B.Tech CSE',
    org: 'NIMS University, Jaipur',
    detail: 'SGPA: 7.2',
    bullets: [],
  },
  {
    id: 'amdox',
    type: 'work' as const,
    period: 'Jan — Apr 2026',
    tag: 'Work',
    title: 'Web Developer Intern',
    org: 'Amdox Technologies',
    detail: '3-month internship · Full-stack web development',
    bullets: [
      'Worked on frontend interfaces and backend functionality',
      'API integration, debugging, and real-world projects',
    ],
  },
  {
    id: 'zytexa',
    type: 'work' as const,
    period: 'Aug 2026 — Present',
    tag: 'Work',
    title: 'Full Stack Developer',
    org: 'Zytexa Technology LLP',
    detail: 'React.js · Node.js · REST APIs · Databases · Automation',
    bullets: [
      'Working on client-facing web applications and automation systems',
      'Full-stack features, API integrations, and workflow automation',
    ],
  },
]

/* ─── hooks ───────────────────────────────────────────────────────── */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    mq.addEventListener('change', (e) => setReduced(e.matches))
  }, [])
  return reduced
}

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

/* ─── 3D card ─────────────────────────────────────────────────────── */
function Card3D({
  item,
  active,
  revealDelay,
}: {
  item: typeof ITEMS[number]
  active: boolean
  revealDelay: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const revealRef = useReveal(revealDelay)
  const reduced = usePrefersReducedMotion()

  const setRefs = useCallback((el: HTMLDivElement | null) => {
    ;(cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el
    ;(revealRef as React.MutableRefObject<HTMLDivElement | null>).current = el
  }, [revealRef])

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return
    const card = cardRef.current; if (!card) return
    const rect = card.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    card.style.transform = `perspective(1000px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg) scale(1.015) translateY(-4px)`
    if (glareRef.current) {
      const gx = ((e.clientX - rect.left) / rect.width) * 100
      const gy = ((e.clientY - rect.top) / rect.height) * 100
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(124,140,255,0.12) 0%, transparent 55%)`
    }
  }, [reduced])

  const onLeave = useCallback(() => {
    const card = cardRef.current; if (!card) return
    card.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.55s ease'
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1) translateY(0)'
    if (glareRef.current) glareRef.current.style.background = 'transparent'
    setTimeout(() => { if (card) card.style.transition = '' }, 580)
  }, [])

  const isEdu = item.type === 'edu'

  return (
    <div
      ref={setRefs}
      className="rv exp-card"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={() => { const c = cardRef.current; if (c) c.style.transition = 'transform 0.12s ease, box-shadow 0.12s ease' }}
      style={{
        position: 'relative',
        borderRadius: 24,
        background: active
          ? 'linear-gradient(135deg, #172033 0%, #1e2d47 100%)'
          : 'rgba(255,255,255,0.82)',
        backdropFilter: active ? 'none' : 'blur(12px)',
        border: active
          ? '1px solid rgba(124,140,255,0.22)'
          : '1px solid rgba(23,32,51,0.10)',
        boxShadow: active
          ? '0 12px 56px rgba(23,32,51,0.28), 0 0 0 1px rgba(124,140,255,0.12)'
          : '0 4px 24px rgba(23,32,51,0.08)',
        padding: 'clamp(1.5rem, 2.5vw, 2rem)',
        transition: 'background 0.5s ease, border 0.5s ease, box-shadow 0.5s ease',
        overflow: 'hidden',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* glare */}
      <div ref={glareRef} aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 24, pointerEvents: 'none', zIndex: 10, transition: 'background 0.08s' }} />

      {/* content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Tag + period */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.85rem', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            padding: '3px 10px', borderRadius: 999,
            background: isEdu
              ? 'rgba(147,197,253,0.18)'
              : 'rgba(124,140,255,0.18)',
            color: isEdu ? '#93C5FD' : '#A5B4FC',
            border: `1px solid ${isEdu ? 'rgba(147,197,253,0.25)' : 'rgba(124,140,255,0.25)'}`,
          }}>{item.tag}</span>
          <span style={{
            fontFamily: 'monospace', fontSize: 10,
            color: active ? '#94A3B8' : '#94a3b8',
            letterSpacing: '0.10em',
          }}>{item.period}</span>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-inter), system-ui',
          fontSize: 'clamp(1.15rem, 1.8vw, 1.5rem)',
          fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.1,
          color: active ? '#F8FAFC' : '#172033',
          marginBottom: '0.3rem',
          transition: 'color 0.4s ease',
        }}>{item.title}</h3>

        {/* Org */}
        <p style={{
          fontSize: 13, fontWeight: 700,
          color: active ? '#A5B4FC' : '#4a6080',
          marginBottom: '0.5rem',
          transition: 'color 0.4s ease',
          letterSpacing: '0.01em',
        }}>{item.org}</p>

        {/* Detail */}
        <p style={{
          fontSize: 12,
          color: active ? '#CBD5E1' : '#64748b',
          lineHeight: 1.6,
          marginBottom: item.bullets.length ? '0.75rem' : 0,
          transition: 'color 0.4s ease',
        }}>{item.detail}</p>

        {/* Bullets */}
        {item.bullets.map(b => (
          <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: '0.35rem' }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: active ? '#7C8CFF' : '#94a3b8', flexShrink: 0, marginTop: 5, transition: 'background 0.4s' }} />
            <span style={{ fontSize: 12, color: active ? '#94A3B8' : '#64748b', lineHeight: 1.55, transition: 'color 0.4s' }}>{b}</span>
          </div>
        ))}
      </div>

      {/* Subtle bottom-right deco */}
      <div aria-hidden style={{
        position: 'absolute', bottom: 12, right: 16,
        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1,
        color: active ? 'rgba(124,140,255,0.08)' : 'rgba(23,32,51,0.05)',
        fontFamily: 'monospace', letterSpacing: '-0.05em',
        pointerEvents: 'none', userSelect: 'none', zIndex: 1,
        transition: 'color 0.4s',
        whiteSpace: 'nowrap',
      }}>
        {item.type === 'edu' ? 'EDU' : item.org.split(' ')[0].toUpperCase()}
      </div>
    </div>
  )
}

/* ─── main ────────────────────────────────────────────────────────── */
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineTrackRef = useRef<HTMLDivElement>(null)
  const lineFillRef = useRef<HTMLDivElement>(null)
  const [fillPct, setFillPct] = useState(0)
  const [activeIdx, setActiveIdx] = useState(-1)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const reduced = usePrefersReducedMotion()

  const r1 = useReveal(0)
  const r2 = useReveal(100)

  /* scroll-driven timeline fill */
  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1,
        (window.innerHeight * 0.6 - rect.top) / (rect.height - window.innerHeight * 0.3)
      ))
      setFillPct(progress * 100)

      // determine active node
      let newActive = -1
      nodeRefs.current.forEach((node, i) => {
        if (!node) return
        const nRect = node.getBoundingClientRect()
        if (nRect.top < window.innerHeight * 0.62) newActive = i
      })
      setActiveIdx(newActive)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{ position: 'relative', background: '#F4F6FA', padding: 'clamp(80px,14vh,140px) var(--gutter)', overflow: 'hidden' }}
    >
      {/* bg blobs */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '30%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,140,255,0.06) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,140,255,0.04) 0%, transparent 70%)' }} />
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* label */}
        <div ref={r1} className="rv" style={{ marginBottom: '1rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.3em', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>
            04 — Experience
          </p>
        </div>

        {/* heading */}
        <div ref={r2} className="rv" style={{ marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <h2 style={{ fontFamily: 'var(--font-inter), system-ui', fontSize: 'clamp(2.4rem,5vw,4.2rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.97, color: '#172033', margin: 0 }}>
            The{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#7C8CFF', letterSpacing: '-0.02em' }}>path</em>
            <br />so far.
          </h2>
        </div>

        {/* timeline */}
        <div className="exp-timeline" style={{ position: 'relative', paddingLeft: 52 }}>

          {/* track */}
          <div
            ref={lineTrackRef}
            className="exp-timeline-track"
            style={{
              position: 'absolute', left: 14, top: 8, bottom: 8,
              width: 2, background: 'rgba(23,32,51,0.10)', borderRadius: 2,
            }}
          />
          {/* fill */}
          <div
            ref={lineFillRef}
            className="exp-timeline-fill"
            style={{
              position: 'absolute', left: 14, top: 8,
              width: 2, borderRadius: 2,
              height: `${fillPct}%`,
              background: 'linear-gradient(to bottom, #7C8CFF, #A5B4FC)',
              boxShadow: '0 0 8px rgba(124,140,255,0.5)',
              transition: reduced ? 'none' : 'height 0.08s linear',
            }}
          />

          {ITEMS.map((item, i) => {
            const isActive = i <= activeIdx
            return (
              <div
                key={item.id}
                style={{ position: 'relative', marginBottom: i < ITEMS.length - 1 ? 'clamp(2rem, 4vw, 3rem)' : 0 }}
              >
                {/* node */}
                <div
                  ref={el => { nodeRefs.current[i] = el }}
                  className="exp-node"
                  style={{
                    position: 'absolute',
                    left: -38, top: 22,
                    width: isActive ? 18 : 12,
                    height: isActive ? 18 : 12,
                    borderRadius: '50%',
                    background: isActive ? '#7C8CFF' : '#CBD5E1',
                    border: isActive ? '2px solid rgba(124,140,255,0.4)' : '2px solid #e2e8f0',
                    boxShadow: isActive ? '0 0 0 6px rgba(124,140,255,0.12), 0 0 16px rgba(124,140,255,0.35)' : 'none',
                    transform: `translateX(-${isActive ? 3 : 0}px)`,
                    transition: reduced ? 'none' : 'all 0.45s cubic-bezier(0.23,1,0.32,1)',
                    zIndex: 2,
                  }}
                />

                {/* card */}
                <Card3D item={item} active={isActive} revealDelay={180 + i * 130} />
              </div>
            )
          })}

          {/* "Your Team?" next node */}
          <div style={{ position: 'relative', marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
            <div className="exp-node" style={{
              position: 'absolute', left: -38, top: 14,
              width: 12, height: 12, borderRadius: '50%',
              border: '2px dashed rgba(124,140,255,0.35)',
              background: 'transparent',
            }} />
            <div style={{
              display: 'inline-flex', flexDirection: 'column', gap: 4,
              border: '1.5px dashed rgba(124,140,255,0.22)',
              borderRadius: 16, padding: '1.1rem 1.5rem',
              background: 'rgba(124,140,255,0.04)',
            }}>
              <p style={{ fontFamily: 'monospace', fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Next</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#7C8CFF', letterSpacing: '-0.02em' }}>Your Team?</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .exp-card { cursor: default; }
        @media (max-width: 600px) {
          .exp-card { transform: none !important; transition: box-shadow 0.3s ease !important; padding: 1.25rem 1rem !important; }
          .exp-timeline { padding-left: 36px !important; }
          .exp-timeline-track, .exp-timeline-fill { left: 8px !important; }
          .exp-node { left: -28px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .exp-card { transform: none !important; transition: background 0.3s, border 0.3s, box-shadow 0.3s !important; }
        }
      `}</style>
    </section>
  )
}
