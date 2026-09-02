'use client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useSession } from 'next-auth/react'
import { Search, Phone, User, ShoppingBag, Sparkles, X } from 'lucide-react'
import type { Page } from '@/types'

export function Header({ pages }: { pages: Page[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const totalItems = useCartStore((s) => s.totalItems())
  const [q, setQ] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const user = session?.user as any

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Main Bar - Deep Navy #0f2b5c */}
      <div className="bg-[#0f2b5c] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4" style={{ height: '72px' }}>
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer group shrink-0">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-white/20 transition-all border border-white/10">
              <Sparkles className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                Түгээлт<span className="text-emerald-400 text-3xl leading-none">.</span>
              </span>
              <span className="text-[10px] text-blue-200 tracking-widest font-medium uppercase -mt-1">
                Онлайн Дэлгүүр
              </span>
            </div>
          </Link>

          {/* Search Bar - Center */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Хайлт хийх..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full bg-white/10 text-white placeholder-blue-200/70 text-sm rounded-full py-2.5 pl-4 pr-11 border border-blue-300/20 focus:outline-none focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 focus:ring-2 focus:ring-blue-400 transition-all shadow-inner"
              />
              {q ? (
                <button
                  type="button"
                  onClick={() => setQ('')}
                  className="absolute right-3 p-1 text-blue-200 hover:text-white focus:outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="absolute right-3 p-1.5 text-blue-200 hover:text-white rounded-full transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            {/* Phone */}
            <a
              href="tel:75955050"
              className="hidden md:flex items-center gap-2 hover:text-emerald-400 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-emerald-500/20">
                <Phone className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-blue-200 uppercase font-medium">Лавлах утас</span>
                <span className="text-xs sm:text-sm font-bold tracking-wide">7595-5050</span>
              </div>
            </a>

            {/* Login / Profile */}
            <Link
              href="/user"
              className="flex items-center gap-2 text-xs sm:text-sm font-medium hover:text-blue-200 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <User className="w-5 h-5 text-blue-200" />
              <span className="hidden sm:inline">
                {isMounted && user ? user.name || 'Бүртгэл' : 'Нэвтрэх'}
              </span>
            </Link>

            {/* Cart Trigger */}
            <Link
              href="/cart"
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all transform hover:scale-105 active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {isMounted && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Сагс</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Bar - Darker Blue #0b224a */}
      <div className="bg-[#0b224a] border-t border-white/10 text-white text-xs sm:text-sm font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto no-scrollbar py-2.5">
          
          {/* Main Links */}
          <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                isActive('/')
                  ? 'bg-blue-600/80 text-white font-bold shadow-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Нүүр
            </Link>
            <Link
              href="/filter/1"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                isActive('/filter/1')
                  ? 'bg-blue-600/80 text-white font-bold shadow-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Онцлох бараа
            </Link>
            <Link
              href="/filter/2"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                isActive('/filter/2')
                  ? 'bg-blue-600/80 text-white font-bold shadow-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Хямдарсан
            </Link>
            <Link
              href="/filter/3"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                isActive('/filter/3')
                  ? 'bg-blue-600/80 text-white font-bold shadow-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Шинэ
            </Link>
            <Link
              href="/filter/4"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                isActive('/filter/4')
                  ? 'bg-blue-600/80 text-white font-bold shadow-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Шилдэг
            </Link>
            <Link
              href="/filter/5"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                isActive('/filter/5')
                  ? 'bg-blue-600/80 text-white font-bold shadow-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Хүргэлт үгүй
            </Link>
          </div>

          {/* Auxiliary Links */}
          <div className="hidden lg:flex items-center gap-4 text-xs text-blue-200/80 whitespace-nowrap border-l border-white/10 pl-4">
            {pages.map((p) => (
              <Link
                key={p.id}
                href={`/pages/${p.purl}`}
                className={`hover:text-white transition-colors ${isActive(`/pages/${p.purl}`) ? 'text-white underline font-semibold' : ''}`}
              >
                {p.title}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </header>
  )
}
