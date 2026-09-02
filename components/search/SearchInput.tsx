'use client'

import { useState, FormEvent, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function SearchInputInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    } else {
      router.push(`/search`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="page-search-form" style={{ position: 'relative', marginBottom: 24 }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Хайх үгээ оруулна уу..."
        className="form-control"
        style={{ 
          height: 52, 
          paddingLeft: 48, 
          borderRadius: 26, 
          fontSize: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid var(--border)'
        }}
      />
      <button 
        type="submit"
        style={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: 'var(--text-light)',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>
      
      {query && (
        <button 
          type="button"
          onClick={() => {
            setQuery('')
            router.push('/search')
          }}
          style={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-light)',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}
    </form>
  )
}

export function SearchInput() {
  return (
    <Suspense fallback={<div style={{ height: 52, marginBottom: 24 }} className="skeleton" />}>
      <SearchInputInner />
    </Suspense>
  )
}
