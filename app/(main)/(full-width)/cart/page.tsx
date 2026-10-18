'use client'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { productImageUrl } from '@/lib/utils'
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Truck } from 'lucide-react'
import Image from 'next/image'


export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, total, deliveryUne, noat, toggleNoat, setDelivery } = useCartStore()
  const [zones, setZones] = useState<Array<{ id: number; title: string; une: number; unegui: number }>>([])
  const [selectedZone, setSelectedZone] = useState(0)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
    fetch('/api/cart/delivery').then(r => r.json()).then(setZones)
  }, [])

  const handleZone = (id: number) => {
    const zone = zones.find(z => z.id === id)
    setSelectedZone(id)
    if (zone) setDelivery(zone.id, zone.unegui ? 0 : zone.une)
  }

  if (!hydrated) return null

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-12 flex flex-col items-center text-center animate-in fade-in duration-300">
        <div className="w-24 h-24 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-3">Сагс хоосон байна</h2>
        <p className="text-slate-500 mb-8 max-w-sm">
          Та манай дэлгүүрээс бараа сонгож сагсандаа нэмээд худалдан авалтаа үргэлжлүүлээрэй.
        </p>
        <Link href="/" className="bg-[#0f2b5c] hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all flex items-center gap-2">
          <span>Дэлгүүр үзэх</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  const noatAmount = noat ? Math.floor(subtotal() * 0.1) : 0

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Checkout Steps - Tailwind version */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 flex items-center justify-between sm:justify-center sm:gap-16">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#0f2b5c] text-white font-bold flex items-center justify-center border-4 border-blue-50 shadow-sm">
            1
          </div>
          <span className="text-xs font-bold text-[#0f2b5c]">Сагс</span>
        </div>
        
        <div className="h-0.5 bg-slate-200 w-16 sm:w-32 rounded-full -mt-6"></div>
        
        <div className="flex flex-col items-center gap-2 opacity-50 grayscale">
          <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 font-bold flex items-center justify-center border-4 border-white">
            2
          </div>
          <span className="text-xs font-bold text-slate-500">Захиалга</span>
        </div>
        
        <div className="h-0.5 bg-slate-200 w-16 sm:w-32 rounded-full -mt-6 hidden sm:block"></div>
        
        <div className="hidden sm:flex flex-col items-center gap-2 opacity-50 grayscale">
          <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 font-bold flex items-center justify-center border-4 border-white">
            3
          </div>
          <span className="text-xs font-bold text-slate-500">Төлбөр</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart items list (Left side - 8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <span>Миний сагс ({items.reduce((s, i) => s + i.hed, 0)})</span>
            </h2>
          </div>
          
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div key={`${item.productId}-${item.songolt}`} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center relative group">
                {/* Remove button absolute on mobile, relative on desktop */}
                <button
                  onClick={() => removeItem(item.productId)}
                  className="absolute sm:relative top-4 right-4 sm:top-0 sm:right-0 sm:order-last p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none shrink-0"
                  title="Устгах"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Product Image */}
                <Link href={`/p/${item.kod}`} className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative">
                  <Image
                    src={productImageUrl(item.image)}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </Link>

                {/* Info & Controls */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                  
                  {/* Title & Options */}
                  <div className="space-y-1 pr-8 sm:pr-0">
                    <Link href={`/p/${item.kod}`} className="text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors line-clamp-2">
                      {item.title}
                    </Link>
                    {item.songolt && (
                      <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md inline-block">
                        Сонголт: <span className="text-slate-700">{item.songolt}</span>
                      </div>
                    )}
                    <div className="text-sm font-bold text-blue-600 sm:hidden mt-2">
                      {formatPrice(item.une)}
                    </div>
                  </div>

                  {/* Quantity & Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-64 shrink-0">
                    <div className="hidden sm:block text-sm font-bold text-slate-700">
                      {formatPrice(item.une)}
                    </div>
                    
                    <select
                      className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none font-bold shadow-sm"
                      value={item.hed}
                      onChange={(e) => updateQty(item.productId, Number(e.target.value))}
                    >
                      {[...Array(30)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>

                    <div className="text-base font-black text-[#0f2b5c] sm:w-24 text-right">
                      {formatPrice(item.une * item.hed)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price summary (Right side - 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sticky top-28">
            <h3 className="text-lg font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">Захиалгын дүн</h3>

            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between text-slate-600">
                <span>Бараа ({items.reduce((s, i) => s + i.hed, 0)} ширхэг)</span>
                <span className="font-bold text-slate-800">{formatPrice(subtotal())}</span>
              </div>

              {/* Delivery zone */}
              <div className="space-y-2 pt-2">
                <span className="text-slate-600 font-bold">Хүргэлт</span>
                <select
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none shadow-sm"
                  value={selectedZone}
                  onChange={(e) => handleZone(Number(e.target.value))}
                >
                  <option value={0}>— Дүүрэг сонгоно уу —</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.title} — {z.unegui ? 'Үнэгүй' : formatPrice(z.une)}
                    </option>
                  ))}
                </select>
                {selectedZone > 0 && (
                  <div className="flex justify-between items-center text-xs mt-1 px-1">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> Хүргэлтийн төлбөр
                    </span>
                    {deliveryUne > 0 ? (
                      <span className="font-bold text-amber-600">{formatPrice(deliveryUne)}</span>
                    ) : (
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Үнэгүй хүргэлт</span>
                    )}
                  </div>
                )}
              </div>

              {/* НӨАТ */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-800 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={noat} 
                    onChange={toggleNoat}
                    className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer" 
                  />
                  <span>НӨАТ (10%) нэмэх</span>
                </label>
                {noat && <span className="font-bold text-slate-800">{formatPrice(noatAmount)}</span>}
              </div>
            </div>

            <div className="border-t border-slate-100 mt-6 pt-6 flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Нийт төлөх дүн</span>
                <span className="text-2xl font-black text-[#0f2b5c]">{formatPrice(total())}</span>
              </div>
              
              <Link 
                href="/cart/checkout" 
                className="w-full bg-[#0f2b5c] hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                <span>Захиалга хийх</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-500 leading-relaxed">
                <span className="font-bold text-slate-700 block mb-0.5">Аюулгүй баталгаатай</span>
                Таны мэдээлэл нууцлагдсан бөгөөд төлбөр нь 100% баталгаатай системээр хийгдэнэ.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
