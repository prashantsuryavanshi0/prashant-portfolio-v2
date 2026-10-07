'use client'
import { useEffect, useRef, useState } from 'react'
import { PROFILE } from '@/lib/data'

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [muted, setMuted] = useState(true)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = false
    video.play()
      .then(() => setMuted(false))
      .catch(() => {
        video.muted = true
        setMuted(true)
        setAutoplayBlocked(true)
        video.play().catch(() => {})
      })

    const unlock = () => {
      if (video.muted) { video.muted = false; setMuted(false); setAutoplayBlocked(false) }
    }
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })

    const io = new IntersectionObserver(
      ([e]) => { if (e.intersectionRatio < 0.35) video.pause(); else video.play().catch(() => {}) },
      { threshold: [0, 0.35] }
    )
    if (sectionRef.current) io.observe(sectionRef.current)
    return () => { io.disconnect() }
  }, [])

  const toggleMute = () => {
    const video = videoRef.current; if (!video) return
    video.muted = !video.muted; setMuted(video.muted)
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      style={{ position: 'relative', height: '100svh', minHeight: 600, overflow: 'hidden', background: '#000' }}
    >
      {/* Full-screen video background */}
      <video
        ref={videoRef}
        loop playsInline preload="auto"
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay — bottom + left for text readability */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: `
          linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.20) 40%, transparent 70%),
          linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 45%, transparent 75%)
        `,
      }} />

      {/* Ghost name */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <span style={{
          fontSize: 'clamp(6rem, 22vw, 20rem)',
          fontWeight: 900, lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(255,255,255,0.06)',
          userSelect: 'none', whiteSpace: 'nowrap',
          letterSpacing: '-0.04em',
        }}>
          {PROFILE.firstName}
        </span>
      </div>

      {/* Content */}
      <div className="hero-content" style={{
        position: 'absolute', inset: 0, zIndex: 3,
        maxWidth: 1320, margin: '0 auto', padding: '0 clamp(18px,4vw,64px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        pointerEvents: 'none',
      }}>
        {/* Left */}
        <div style={{ pointerEvents: 'all', maxWidth: 340, paddingTop: '5rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.50)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            00 — Portfolio
          </p>
          <h1 style={{
            fontFamily: 'var(--font-inter), system-ui',
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1,
            color: '#fff', marginBottom: '1.25rem',
          }}>
            {PROFILE.role}.
          </h1>
          <p className="hero-tagline" style={{ fontSize: 14, color: 'rgba(255,255,255,0.62)', lineHeight: 1.8, marginBottom: '2rem', maxWidth: 280 }}>
            {PROFILE.summary.split('.')[0]}.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            <button
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '0.65rem 1.5rem', borderRadius: 999, background: '#fff', color: '#0d0d0d', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              Explore Work
            </button>
            <a href={`mailto:${PROFILE.email}`}
              style={{ padding: '0.65rem 1.5rem', borderRadius: 999, border: '1.5px solid rgba(255,255,255,0.35)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)' }}>
              Let&apos;s Talk
            </a>
            <a href={PROFILE.resume} download
              style={{ padding: '0.65rem 1.5rem', borderRadius: 999, border: '1.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.60)', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
              Résumé ↓
            </a>
          </div>
        </div>

        {/* Right — stats (hidden on mobile) */}
        <div className="hero-stats" style={{ pointerEvents: 'all', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingTop: '5rem', alignItems: 'flex-end' }}>
          {[
            { label: 'Projects', value: '30+ Built' },
            { label: 'Stack', value: 'MERN + More' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              textAlign: 'right',
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 16, padding: '12px 18px', minWidth: 140,
            }}>
              <p style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
              <p style={{ fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.03em', margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sound toggle */}
      <button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}
        style={{
          position: 'absolute', bottom: 28, right: 28, zIndex: 10,
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(0,0,0,0.40)', color: '#fff',
          border: '1.5px solid rgba(255,255,255,0.22)',
          backdropFilter: 'blur(10px)',
          cursor: 'pointer', fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      {autoplayBlocked && (
        <div style={{
          position: 'absolute', bottom: 28, right: 28, zIndex: 9,
          width: 44, height: 44, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.5)',
          animation: 'ping 1.5s ease-out infinite', pointerEvents: 'none',
        }} />
      )}

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      }}>
        <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Scroll</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)' }} />
      </div>

      <style>{`
        @keyframes ping { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(2.2);opacity:0} }

        /* ── Tablet (max 900px) ── */
        @media (max-width: 900px) {
          .hero-stats { display: none !important; }
          .hero-content {
            align-items: flex-end !important;
            padding-bottom: 3.5rem !important;
          }
          .hero-content > div:first-child {
            padding-top: 0 !important;
            max-width: 100% !important;
          }
        }

        /* ── Mobile (max 640px) ── */
        @media (max-width: 640px) {
          .hero-tagline { display: none !important; }
          .hero-content {
            padding: 0 20px !important;
            padding-bottom: 3rem !important;
          }
        }
      `}</style>
    </section>
  )
}
