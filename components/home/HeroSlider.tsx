'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Banner } from '@/types'
import { bannerImageUrl } from '@/lib/utils'

export function HeroSlider({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent((c) => (c + 1) % banners.length), [banners.length])

  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(next, 4500)
    return () => clearInterval(t)
  }, [next, banners.length])

  if (!banners.length) return null

  return (
    <div className="hero-slider" style={{ marginBottom: 24 }}>
      {banners.map((b, i) => (
        <a
          key={b.id}
          href={b.holboos || '#'}
          className={`hero-slide ${i === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${bannerImageUrl(b.image)})` }}
          aria-label={b.title || 'Banner'}
        />
      ))}
      {banners.length > 1 && (
        <div className="hero-dots">
          {banners.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Слайд ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
