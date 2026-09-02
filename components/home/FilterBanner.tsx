'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Banner } from '@/types'

const UPLOAD = process.env.NEXT_PUBLIC_UPLOAD_URL || ''

export function FilterBanner({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent((c) => (c + 1) % banners.length), [banners.length])

  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next, banners.length])

  if (!banners.length) return null

  return (
    <div className="filter-banner-container" style={{ marginBottom: 24 }}>
      {banners.map((b, i) => (
        <a
          key={b.id}
          href={b.holboos || '#'}
          className={`hero-slide ${i === current ? 'active' : ''}`}
          style={{ 
            backgroundImage: `url(${UPLOAD}/banners/${b.image})`,
            borderRadius: 'var(--radius-xl)'
          }}
          aria-label={b.title || 'Filter Banner'}
        />
      ))}
      {banners.length > 1 && (
        <div className="hero-dots">
          {banners.map((_, i) => (
             <button
              key={i}
              className={`hero-dot ${i === current ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setCurrent(i); }}
              aria-label={`Слайд ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
