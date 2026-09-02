'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useTransition } from 'react'

interface ProductFiltersProps {
  categories: any[]
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const [featured, setFeatured] = useState(searchParams.get('featured') || '')
  const [cat, setCat] = useState(searchParams.get('cat') || '')
  const [q, setQ] = useState(searchParams.get('q') || '')

  // Update URL whenever filters change
  const applyFilters = (newFilters: { status?: string, featured?: string, cat?: string, q?: string }) => {
    const params = new URLSearchParams()
    
    const currentStatus = newFilters.status !== undefined ? newFilters.status : status
    const currentFeatured = newFilters.featured !== undefined ? newFilters.featured : featured
    const currentCat = newFilters.cat !== undefined ? newFilters.cat : cat
    const currentQ = newFilters.q !== undefined ? newFilters.q : q

    if (currentStatus) params.set('status', currentStatus)
    if (currentFeatured) params.set('featured', currentFeatured)
    if (currentCat) params.set('cat', currentCat)
    if (currentQ) params.set('q', currentQ)
    
    // Reset to page 1 when filtering
    params.set('page', '1')

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const handleClear = () => {
    setStatus('')
    setFeatured('')
    setCat('')
    setQ('')
    startTransition(() => {
      router.push(`?page=1`)
    })
  }

  // Handle Search Input Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyFilters({ q: e.currentTarget.value })
    }
  }

  const hasFilters = status || featured || cat || q

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end', opacity: isPending ? 0.6 : 1, transition: 'opacity 0.2s' }}>
      {hasFilters && (
        <button 
          onClick={handleClear} 
          className="btn btn-outline btn-sm" 
          style={{ height: 38, border: 'none', color: 'var(--danger)' }}
        >
          ✕ Цэвэрлэх
        </button>
      )}

      <select 
        value={status} 
        onChange={(e) => {
          setStatus(e.target.value)
          applyFilters({ status: e.target.value })
        }} 
        className="form-control" 
        style={{ width: 140, height: 38 }}
      >
        <option value="">Бүх төлөв</option>
        <option value="active">Идэвхтэй</option>
        <option value="inactive">Идэвхгүй</option>
        <option value="low_stock">Дуусаж буй</option>
        <option value="out_of_stock">Дууссан</option>
      </select>

      <select 
        value={featured} 
        onChange={(e) => {
          setFeatured(e.target.value)
          applyFilters({ featured: e.target.value })
        }} 
        className="form-control" 
        style={{ width: 140, height: 38 }}
      >
        <option value="">Бүх бараа</option>
        <option value="1">Онцлох бараа</option>
      </select>

      <select 
        value={cat} 
        onChange={(e) => {
          setCat(e.target.value)
          applyFilters({ cat: e.target.value })
        }} 
        className="form-control" 
        style={{ width: 180, height: 38 }}
      >
        <option value="">Бүх ангилал</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.isSub ? `— ${c.title}` : c.title}
          </option>
        ))}
      </select>

      <div style={{ position: 'relative' }}>
        <input 
          type="text" 
          value={q} 
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => applyFilters({ q })}
          placeholder="Нэр, Код... (Enter)" 
          className="form-control" 
          style={{ width: 180, height: 38 }} 
        />
      </div>
    </div>
  )
}
