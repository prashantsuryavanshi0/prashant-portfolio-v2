'use client'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'

const About       = dynamic(() => import('@/components/About'))
const Skills      = dynamic(() => import('@/components/Skills'))
const Work        = dynamic(() => import('@/components/Work'))
const Experience  = dynamic(() => import('@/components/Experience'))
const Achievements = dynamic(() => import('@/components/Achievements'))
const Contact     = dynamic(() => import('@/components/Contact'))

export default function Home() {
  useEffect(() => {
    const observe = () => {
      const io = new IntersectionObserver(
        (entries) => entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
        }),
        { threshold: 0.1 }
      )
      document.querySelectorAll('.rv, .rv-left').forEach(el => io.observe(el))
      return io
    }
    // Run once on mount, then re-observe as lazy sections mount
    let io = observe()
    const timer = setInterval(() => {
      io.disconnect()
      io = observe()
    }, 800)
    setTimeout(() => clearInterval(timer), 5000)
    return () => { io.disconnect(); clearInterval(timer) }
  }, [])

  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Work />
        <Experience />
        <Achievements />
        <Contact />
      </main>
    </>
  )
}
