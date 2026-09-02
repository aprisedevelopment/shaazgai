import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: { default: 'Түгээлт — Онлайн Дэлгүүр', template: '%s | Түгээлт' },
  description: 'Монголын онлайн дэлгүүр. Дотоодын болон импортын бараа. Хямд үнэ, хурдан хүргэлт.',
  keywords: ['онлайн дэлгүүр', 'монгол', 'худалдаа', 'tugeelt'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tugeelt.mn'),
  openGraph: {
    siteName: 'Түгээлт',
    type: 'website',
    locale: 'mn_MN',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
