import type { Metadata } from 'next'
import { Inter_Tight } from 'next/font/google'
import './globals.css'

const inter = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Prashant Aryan — Full Stack Developer',
  description:
    'Full Stack Developer with hands-on experience in React.js, Node.js, REST APIs, MongoDB, and PostgreSQL.',
  themeColor: '#f4f2ee',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} style={{ scrollBehavior: 'smooth' }}>
      <body>{children}</body>
    </html>
  )
}
