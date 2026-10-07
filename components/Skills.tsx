'use client'
import { useState } from 'react'
import { SKILL_GROUPS } from '@/lib/data'

const FAMILY_COLORS: Record<string, string> = {
  Languages: '#3b82f6', Frontend: '#8b5cf6', Backend: '#10b981',
  Databases: '#f59e0b', Tools: '#6b7280', Concepts: '#ec4899', 'Soft Skills': '#14b8a6',
}

export default function Skills() {
  const [filter, setFilter] = useState<string | null>(null)
  const allSkills = SKILL_GROUPS.flatMap(g => g.skills.map(s => ({ ...s, family: g.family })))
  const families = SKILL_GROUPS.map(g => g.family)

  return (
    <section id="skills" style={{ background: 'var(--paper)', padding: 'clamp(80px,14vh,140px) var(--gutter)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <p className="rv" style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.2em', color: 'var(--faint)', textTransform: 'uppercase', marginBottom: '1rem' }}>
          02 — Skills
        </p>
        <h2 className="rv" style={{ '--i': 1, fontFamily: 'var(--font-inter), system-ui', fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1, marginBottom: '2.5rem' } as React.CSSProperties}>
          The periodic table of my <em style={{ fontStyle: 'italic', color: 'var(--mute)', fontWeight: 400 }}>stack.</em>
        </h2>

        {/* Family filters */}
        <div className="rv" style={{ '--i': 2, display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' } as React.CSSProperties}>
          <button
            onClick={() => setFilter(null)}
            style={{
              padding: '0.4rem 1rem', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: !filter ? 'var(--ink)' : 'transparent',
              color: !filter ? 'var(--paper)' : 'var(--mute)',
              border: '1.5px solid var(--line)', transition: 'all 0.2s',
            }}
          >
            All
          </button>
          {families.map(f => (
            <button
              key={f}
              onClick={() => setFilter(filter === f ? null : f)}
              style={{
                padding: '0.4rem 1rem', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                background: filter === f ? FAMILY_COLORS[f] : 'transparent',
                color: filter === f ? '#fff' : 'var(--mute)',
                border: `1.5px solid ${filter === f ? FAMILY_COLORS[f] : 'var(--line)'}`,
                transition: 'all 0.2s',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Periodic grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '0.75rem',
        }}>
          {allSkills.map((skill, i) => {
            const dimmed = filter && skill.family !== filter
            const color = FAMILY_COLORS[skill.family]
            return (
              <div
                key={skill.n}
                title={`${skill.name} · ${skill.family}`}
                style={{
                  background: 'var(--card)',
                  border: `1.5px solid ${dimmed ? 'var(--line)' : color + '40'}`,
                  borderRadius: 12,
                  padding: '12px 10px 10px',
                  display: 'flex', flexDirection: 'column', gap: 4,
                  opacity: dimmed ? 0.25 : 1,
                  transition: 'all 0.3s var(--ease)',
                  cursor: 'default',
                  animationDelay: `${i * 30}ms`,
                }}
                onMouseEnter={e => { if (!dimmed) (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}
              >
                <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--faint)', lineHeight: 1 }}>{skill.n.toString().padStart(2, '0')}</span>
                <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.02em', color: dimmed ? 'var(--faint)' : color, lineHeight: 1 }}>{skill.symbol}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: dimmed ? 'var(--faint)' : 'var(--ink)', lineHeight: 1.3, wordBreak: 'break-word' }}>{skill.name}</span>
                <span style={{ fontSize: 8, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1 }}>{skill.family}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
