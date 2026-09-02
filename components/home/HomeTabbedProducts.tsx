'use client'
import { useState, useCallback } from 'react'
import { ProductCard, ProductCardSkeleton } from '@/components/home/ProductCard'
import type { Product } from '@/types'
import { Sparkles, Clock, HeartHandshake } from 'lucide-react'

type TabType = 'featured' | 'new' | 'suggested'

interface Props {
  initialFeatured: Product[]
  initialNew: Product[]
  initialSuggested: Product[]
}

export function HomeTabbedProducts({ initialFeatured, initialNew, initialSuggested }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('featured')
  
  // Data states
  const [data, setData] = useState<{ [key in TabType]: Product[] }>({
    featured: initialFeatured,
    new: initialNew,
    suggested: initialSuggested
  })
  
  const [lastIds, setLastIds] = useState<{ [key in TabType]: number | null }>({
    featured: initialFeatured.length > 0 ? initialFeatured[initialFeatured.length - 1].id : null,
    new: initialNew.length > 0 ? initialNew[initialNew.length - 1].id : null,
    suggested: initialSuggested.length > 0 ? initialSuggested[initialSuggested.length - 1].id : null
  })

  const [hasMore, setHasMore] = useState<{ [key in TabType]: boolean }>({
    featured: initialFeatured.length === 8,
    new: initialNew.length === 8,
    suggested: initialSuggested.length === 8
  })

  const [loading, setLoading] = useState(false)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore[activeTab]) return
    setLoading(true)

    const filterType = activeTab === 'featured' ? '1' : activeTab === 'new' ? '3' : '4'
    const lastId = lastIds[activeTab]

    const params = new URLSearchParams()
    params.set('type', 'filter')
    params.set('filterType', filterType)
    params.set('take', '8')
    if (lastId) params.set('lastId', String(lastId))

    const res = await fetch(`/api/products/load-more?${params}`)
    const json = await res.json()

    if (json.items?.length > 0) {
      setData(prev => ({ ...prev, [activeTab]: [...prev[activeTab], ...json.items] }))
      setLastIds(prev => ({ ...prev, [activeTab]: json.lastId }))
      setHasMore(prev => ({ ...prev, [activeTab]: json.hasMore }))
    } else {
      setHasMore(prev => ({ ...prev, [activeTab]: false }))
    }
    setLoading(false)
  }, [loading, hasMore, activeTab, lastIds])

  const tabs = [
    { id: 'featured', label: 'Онцлох бараа', icon: <Sparkles className="w-4 h-4 text-emerald-500" /> },
    { id: 'new', label: 'Шинэ бараа', icon: <Clock className="w-4 h-4 text-blue-500" /> },
    { id: 'suggested', label: 'Санал болгох', icon: <HeartHandshake className="w-4 h-4 text-rose-500" /> },
  ]

  const activeData = data[activeTab]

  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="flex items-center gap-2 sm:gap-6 border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
        {tabs.map(t => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as TabType)}
              className={`flex items-center gap-2 px-4 py-3 text-sm sm:text-base transition-all whitespace-nowrap ${
                isActive 
                  ? 'border-b-2 border-blue-600 font-bold text-slate-800' 
                  : 'border-b-2 border-transparent font-medium text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {activeData.map(p => <ProductCard key={p.id} product={p} layoutMode="grid" />)}
        {loading && [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>

      {/* Load More */}
      {hasMore[activeTab] && !loading && (
        <div className="flex justify-center mt-10">
          <button 
            className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200/60 font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2"
            onClick={loadMore}
          >
            Цааш үзэх
          </button>
        </div>
      )}
      {!hasMore[activeTab] && activeData.length > 0 && (
        <div className="text-center mt-10 text-slate-400 text-sm font-medium">
          Бүх барааг харуулж дууслаа
        </div>
      )}
    </div>
  )
}
