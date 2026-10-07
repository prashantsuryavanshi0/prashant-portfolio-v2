'use client'
import { useEffect, useRef } from 'react'
import { PROFILE } from '@/lib/data'

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => el.classList.add('is-in'), delay); io.disconnect() }
    }, { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [delay])
  return ref
}

function IDCard() {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current; if (!card) return
    const idle = setInterval(() => {
      const angle = Math.sin(Date.now() / 1800) * 3
      card.style.transform = `perspective(900px) rotateY(${angle}deg) rotateX(0.5deg)`
    }, 16)
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const rx = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -12
      const ry = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 12
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`
    }
    const onLeave = () => { card.style.transform = '' }
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => { clearInterval(idle); card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave) }
  }, [])

  return (
    <div
      ref={cardRef}
      style={{
        width: 280,
        background: 'linear-gradient(145deg, #1a1f2e 0%, #0f1117 60%, #1a1f2e 100%)',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 2px 0 inset rgba(255,255,255,0.08), 0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,120,255,0.15)',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'transform 0.12s ease',
        cursor: 'default',
        willChange: 'transform',
      }}
    >
      {/* Top accent bar */}
      <div style={{
        height: 4,
        background: 'linear-gradient(90deg, #6378ff, #a78bfa, #38bdf8, #34d399)',
      }}/>

      {/* Top band */}
      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.36em', textTransform: 'uppercase' }}>Developer ID</p>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }}/>)}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '24px 20px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        {/* Avatar */}
        <div style={{
          width: 90, height: 108, borderRadius: 14,
          background: 'linear-gradient(135deg, #6378ff22 0%, #38bdf822 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(99,120,255,0.25)',
          fontSize: 28, fontWeight: 900,
          color: 'rgba(99,120,255,0.7)',
          letterSpacing: '-0.04em', position: 'relative', overflow: 'hidden',
        }}>
          PA
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(99,120,255,0.08) 0%, transparent 60%)' }}/>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: 900, fontSize: 15, letterSpacing: '0.06em', color: '#fff' }}>PRASHANT ARYAN</p>
          <p style={{ fontSize: 11, color: 'rgba(99,120,255,0.8)', marginTop: 5, fontWeight: 600, letterSpacing: '0.08em' }}>Full Stack Developer</p>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,120,255,0.3), transparent)' }}/>

        {/* Details */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[['ID No.', 'PA-2022-CSE'], ['Dept.', 'Engineering'], ['Valid till', '2026']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'monospace', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{k}</span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: 11 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Barcode */}
        <div style={{ width: '100%', height: 28, background: 'repeating-linear-gradient(90deg, rgba(99,120,255,0.2) 0, rgba(99,120,255,0.2) 1.5px, transparent 1.5px, transparent 4px)', borderRadius: 2 }}/>
        <p style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textAlign: 'center', letterSpacing: '0.08em' }}>
          github.com/prashantsuryavanshi0
        </p>

        {/* Holographic sticker */}
        <div style={{
          alignSelf: 'flex-end',
          width: 32, height: 32, borderRadius: '50%',
          background: 'conic-gradient(from 0deg, #6378ff, #a78bfa, #38bdf8, #34d399, #6378ff)',
          opacity: 0.65, border: '1px solid rgba(255,255,255,0.15)',
        }}/>
      </div>
    </div>
  )
}

export default function About() {
  const r1 = useReveal(0)
  const r2 = useReveal(80)
  const r3 = useReveal(160)
  const r4 = useReveal(240)
  const r5 = useReveal(320)

  return (
    <section id="about" style={{ background: 'var(--card)', padding: 'clamp(80px,14vh,140px) var(--gutter)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>

        {/* Label */}
        <div ref={r1} className="rv" style={{ marginBottom: '1.25rem' }}>
          <p style={{
            fontFamily: 'monospace', fontSize: 11,
            letterSpacing: '0.28em', color: '#888',
            textTransform: 'uppercase', fontWeight: 600,
          }}>
            01 &mdash; About
          </p>
        </div>

        {/* Heading */}
        <div ref={r2} className="rv" style={{ marginBottom: '4.5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-inter), system-ui',
            fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '-0.05em',
            lineHeight: 1.08,
            color: 'var(--ink)',
          }}>
            Full Stack Developer building{' '}
            <em style={{
              fontStyle: 'italic',
              fontWeight: 300,
              color: '#aaa',
              letterSpacing: '-0.02em',
            }}>real&#8209;world</em>
            {' '}products.
          </h2>
        </div>

        {/* Three columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '3rem', alignItems: 'start' }}>

          {/* Bio + buttons */}
          <div ref={r3} className="rv">
            <p style={{ fontSize: 15, lineHeight: 1.9, color: '#555', marginBottom: '2.25rem', fontWeight: 400 }}>
              {PROFILE.summary}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              <a href={PROFILE.resume} download style={{
                padding: '0.65rem 1.5rem', borderRadius: 999,
                background: 'var(--ink)', color: '#fff',
                fontSize: 13, fontWeight: 700, textDecoration: 'none',
              }}>
                {'Résumé ↓'}
              </a>
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" style={{
                padding: '0.65rem 1.5rem', borderRadius: 999,
                border: '1.5px solid var(--line)', color: 'var(--ink)',
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
              }}>
                {'GitHub ↗'}
              </a>
              <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" style={{
                padding: '0.65rem 1.5rem', borderRadius: 999,
                border: '1.5px solid var(--line)', color: 'var(--ink)',
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
              }}>
                {'LinkedIn ↗'}
              </a>
            </div>
          </div>

          {/* ID Card */}
          <div ref={r4} className="rv" style={{ display: 'flex', justifyContent: 'center' }}>
            <IDCard />
          </div>

          {/* Quick facts */}
          <div ref={r5} className="rv">
            <p style={{
              fontFamily: 'monospace', fontSize: 10,
              letterSpacing: '0.25em', color: '#888',
              textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600,
            }}>
              Quick Facts
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: 'Location', value: 'India' },
                { label: 'Education', value: 'B.Tech CSE — NIMS University' },
                { label: 'Current Role', value: 'Full Stack Developer · Zytexa Technology LLP' },
                { label: 'Email', value: PROFILE.email },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'flex', flexDirection: 'column', gap: 4,
                  padding: '14px 0', borderBottom: '1px solid var(--line)',
                }}>
                  <span style={{
                    fontFamily: 'monospace', fontSize: 9,
                    color: '#999', textTransform: 'uppercase',
                    letterSpacing: '0.18em', fontWeight: 600,
                  }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600, wordBreak: 'break-word', lineHeight: 1.4 }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <p style={{
              fontSize: 13, color: '#999',
              fontStyle: 'italic', marginTop: '1.5rem',
              lineHeight: 1.75, borderLeft: '2px solid var(--line)',
              paddingLeft: '1rem',
            }}>
              &ldquo;Strong problem-solving, communication, and teamwork skills.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
