'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { ProductCard, ProductCardSkeleton } from '@/components/home/ProductCard'
import type { Product } from '@/types'

interface Props {
  type: 'cat' | 'filter' | 'search'
  catIds?: number[]
  filterType?: string
  searchQuery?: string
  initialLastId?: number
  initialProducts?: Product[]
}

export function InfiniteProducts({ type, catIds, filterType, searchQuery, initialLastId, initialProducts = [] }: Props) {
  const [items, setItems] = useState<Product[]>(initialProducts)
  const [lastId, setLastId] = useState(initialLastId)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loaderRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    const params = new URLSearchParams()
    if (lastId) params.set('lastId', String(lastId))
    if (type === 'cat' && catIds) params.set('catIds', catIds.join(','))
    if (type === 'filter' && filterType) params.set('filterType', filterType)
    if (type === 'search' && searchQuery) params.set('q', searchQuery)
    params.set('type', type)

    const res = await fetch(`/api/products/load-more?${params}`)
    const data = await res.json()
    if (data.items?.length > 0) {
      setItems((prev) => [...prev, ...data.items])
      setLastId(data.lastId)
      setHasMore(data.hasMore)
    } else {
      setHasMore(false)
    }
    setLoading(false)
  }, [loading, hasMore, lastId, type, catIds, filterType, searchQuery])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) load() },
      { rootMargin: '200px' }
    )
    if (loaderRef.current) observerRef.current.observe(loaderRef.current)
    return () => observerRef.current?.disconnect()
  }, [load])

  return (
    <>
      <div className="flex justify-end mb-4">
        <div className="flex bg-white border border-slate-200 rounded-lg p-1 gap-1 shadow-sm">
          <button 
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`} 
            onClick={() => setViewMode('grid')}
            title="Грид харах"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </button>
          <button 
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`} 
            onClick={() => setViewMode('list')}
            title="Жагсаалтаар харах"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </button>
        </div>
      </div>
      
      <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6' : 'flex flex-col gap-4'}>
        {items.map((p) => <ProductCard key={p.id} product={p} layoutMode={viewMode} />)}
      </div>
      <div ref={loaderRef} className="h-10 flex items-center justify-center mt-8">
        {loading && (
          <div className={`w-full ${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6' : 'flex flex-col gap-4'}`}>
            {[...Array(viewMode === 'grid' ? 4 : 2)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}
        {!hasMore && items.length > 0 && (
          <p className="text-muted" style={{ fontSize: 13 }}>Бүх бараа харуулсан</p>
        )}
      </div>
    </>
  )
}
