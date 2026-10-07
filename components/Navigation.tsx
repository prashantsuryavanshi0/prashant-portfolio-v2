'use client'
import { useEffect, useRef, useState } from 'react'
import { NAV, PROFILE } from '@/lib/data'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const total = document.body.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = NAV.map(n => n.toLowerCase())
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <>
      {/* Scroll progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 100, background: 'var(--line)' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--ink)', transition: 'width 0.1s linear' }} />
      </div>

      <nav style={{
        position: 'fixed', top: 12, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', gap: 12,
      }}>
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            border: scrolled ? '2px solid var(--ink)' : '2px solid rgba(255,255,255,0.65)',
            background: scrolled ? 'var(--ink)' : 'rgba(255,255,255,0.12)',
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 800, letterSpacing: '-0.02em',
            transition: 'all 0.3s var(--ease)',
            backdropFilter: 'blur(8px)',
          }}>
            PA
          </div>
          <span style={{
            fontSize: 14, fontWeight: 600,
            color: scrolled ? 'var(--ink)' : '#ffffff',
            opacity: scrolled ? 0 : 1, transition: 'opacity 0.3s, color 0.3s',
            whiteSpace: 'nowrap',
          }}>
            {PROFILE.name}
          </span>
        </button>

        {/* Desktop pill nav */}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--line)',
          borderRadius: 999,
          padding: '4px 6px',
          gap: 2,
        }}
          className="hidden-mobile"
        >
          {NAV.map(item => {
            const id = item.toLowerCase()
            const isActive = active === id
            return (
              <button
                key={item}
                onClick={() => scrollTo(id)}
                style={{
                  position: 'relative',
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#fff' : 'var(--ink-2)',
                  background: isActive ? 'var(--ink)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s var(--ease)',
                }}
              >
                {item}
              </button>
            )
          })}
        </div>

        {/* Mobile button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            padding: '6px 16px', borderRadius: 999,
            border: '1px solid var(--line)',
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(12px)',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--ink)',
          }}
          className="show-mobile"
        >
          {menuOpen ? '✕ Close' : 'Menu'}
        </button>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'var(--paper)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 2rem',
        }}>
          {NAV.map((item, i) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              style={{
                textAlign: 'left', padding: '1.25rem 0',
                borderBottom: '1px solid var(--line)',
                fontSize: 'clamp(1.8rem,6vw,3rem)', fontWeight: 800,
                letterSpacing: '-0.03em', color: 'var(--ink)',
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '1rem',
                borderBottomStyle: 'solid',
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--faint)', fontWeight: 400 }}>
                0{i + 1}
              </span>
              {item}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </>
  )
}
