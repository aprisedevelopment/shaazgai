'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useToast } from '@/components/ui/Toast'
import { formatPrice, calcDiscount, productImageUrl } from '@/lib/utils'
import type { Product } from '@/types'
import { ShoppingCart, Truck, Eye } from 'lucide-react'
import { QuickViewModal } from '@/components/product/QuickViewModal'

export function ProductCard({ product, layoutMode = 'grid' }: { product: Product; layoutMode?: 'grid' | 'list' }) {
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)
  const { addToast } = useToast()
  
  const [adding, setAdding] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const discount = calcDiscount(product.une, product.unehuuchin)
  const img = productImageUrl(product.image)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAdding(true)
    addItem({
      productId: product.id,
      kod: product.kod,
      title: product.title,
      image: product.image || undefined,
      une: product.une,
      hed: 1,
    })
    addToast(`"${product.title.substring(0, 28)}..." сагсанд нэмэгдлээ`, 'success')
    setTimeout(() => setAdding(false), 600)
  }

  const onSelect = () => {
    router.push(`/p/${product.kod}`)
  }

  // LIST VIEW LAYOUT
  if (layoutMode === 'list') {
    return (
      <div
        onClick={onSelect}
        className="bg-white rounded-xl border border-slate-200/90 hover:border-blue-400 p-4 flex flex-col sm:flex-row items-center gap-4 cursor-pointer transition-all hover:shadow-md group"
      >
        {/* Product Image */}
        <div className="relative w-full sm:w-40 h-40 rounded-lg overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
          <img
            src={img}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow">
              -{discount}%
            </span>
          )}
          {product.duussan === 1 && (
            <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-white font-bold text-[13px]">
              ДУУССАН
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2 w-full">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
            <span>Код: {product.kod}</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">{product.title.split(' ')[0]}</span>
          </div>

          <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </div>

        {/* Price & Action */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-3">
          <div className="text-left sm:text-right">
            <p className="text-lg font-black text-[#0f2b5c]">
              {formatPrice(product.une)}
            </p>
            {product.unehuuchin > product.une && (
              <p className="text-xs text-slate-400 line-through">
                {formatPrice(product.unehuuchin)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {product.duussan !== 1 && (
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="bg-[#0f2b5c] hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Сагс</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // GRID VIEW LAYOUT
  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden flex items-center justify-center p-2">
        <img
          src={img}
          alt={product.title}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-[#f97316] text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md z-10">
            -{discount}%
          </span>
        )}
        
        {product.duussan === 1 && (
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-white font-bold text-[13px] z-20">
            ДУУССАН
          </div>
        )}

        {/* Hover Actions (QuickView) */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowQuickView(true); }}
            title="Дэлгэрэнгүй"
            className="w-8 h-8 rounded-full bg-white text-slate-600 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center shadow-md transition-all hover:scale-110"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        {/* Title */}
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>
        </div>

        {/* Bottom Metadata & Price */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          {/* Price & Cart Button */}
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-base sm:text-lg font-black text-[#0f2b5c] leading-tight">
                {formatPrice(product.une)}
              </p>
              {product.unehuuchin > product.une ? (
                <p className="text-[11px] text-slate-400 line-through leading-none mt-0.5">
                  {formatPrice(product.unehuuchin)}
                </p>
              ) : (
                <div className="h-3" />
              )}
            </div>

            {/* Circular Add-to-cart button */}
            {product.duussan !== 1 && (
              <button
                onClick={handleAddToCart}
                disabled={adding}
                title="Сагсанд нэмэх"
                className="w-10 h-10 rounded-full bg-[#0f2b5c] hover:bg-blue-600 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all transform hover:scale-110 active:scale-95 shrink-0 disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {showQuickView && (
        <div onClick={(e) => e.stopPropagation()}>
          <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
        </div>
      )}
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden animate-pulse">
      <div className="aspect-square w-full bg-slate-200"></div>
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="flex items-end justify-between gap-2 mt-2">
            <div>
              <div className="h-6 bg-slate-200 rounded w-20"></div>
              <div className="h-3 bg-slate-200 rounded w-16 mt-1"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
          </div>
          <div className="flex justify-between mt-2">
            <div className="h-3 bg-slate-200 rounded w-16"></div>
            <div className="h-3 bg-slate-200 rounded w-8"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
