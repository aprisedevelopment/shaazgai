'use client'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import type { PaymentMethod } from '@/types'
import { Check, ShieldCheck, User, Phone, MapPin, Calendar, Clock, CreditCard, ArrowRight, AlertCircle } from 'lucide-react'

const PAYMENT_METHODS = [
  { value: 1 as PaymentMethod, label: 'Бэлнээр', desc: 'Хүргэлтэнд бэлнээр төлнө', icon: '💵' },
  { value: 2 as PaymentMethod, label: 'Дансаар', desc: 'Банкны данс руу шилжүүлнэ', icon: '🏦' },
  { value: 4 as PaymentMethod, label: 'QPay', desc: 'QR кодоор төлнө', icon: '📱' },
  { value: 5 as PaymentMethod, label: 'Golomt Карт', desc: 'Голомт банкны картаар', icon: '💳' },
  { value: 6 as PaymentMethod, label: 'SocialPay', desc: 'SocialPay апп-аар', icon: '🔵' },
  { value: 7 as PaymentMethod, label: 'HiPay', desc: 'HiPay картаар', icon: '🟣' },
  { value: 8 as PaymentMethod, label: 'LendMN', desc: 'LendMN-ээр хэсэгчлэн', icon: '🟡' },
]

const TIME_SLOTS = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00']

export default function CheckoutPage() {
  const { items, total, subtotal, deliveryUne, noat, clearCart } = useCartStore()
  const { data: session } = useSession()
  const router = useRouter()

  const [form, setForm] = useState({
    ner: (session?.user?.name) || '',
    utas1: '', utas2: '', ognoo: '', tsag: '', hayag: '', comment: '',
  })
  const [tolbor, setTolbor] = useState<PaymentMethod>(4)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session?.user?.name && !form.ner) {
      setForm((f) => ({ ...f, ner: session.user?.name || '' }))
    }
  }, [session?.user?.name])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) { setError('Сагс хоосон байна.'); return }
    if (!form.ner || !form.utas1 || !form.hayag) { setError('Заавал талбаруудыг бөглөнө үү.'); return }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tolbor_helber: tolbor,
          noat: noat ? 1 : 0,
          niitdun: String(total()),
          deliveryUne,
          items,
        }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.error || 'Алдаа гарлаа.'); setSubmitting(false); return }
      clearCart()
      router.push(`/cart/payment?h=${tolbor}&zid=${data.zid}`)
    } catch { setError('Сүлжээний алдаа.'); setSubmitting(false) }
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-12 flex flex-col items-center text-center animate-in fade-in duration-300">
        <div className="w-24 h-24 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-3">Сагс хоосон байна</h2>
        <Link href="/" className="bg-[#0f2b5c] hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all mt-4">
          Нүүр хуудас
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Checkout Steps */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 flex items-center justify-between sm:justify-center sm:gap-16">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 font-bold flex items-center justify-center border-4 border-emerald-100 shadow-sm">
            <Check className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-emerald-600">Сагс</span>
        </div>
        
        <div className="h-0.5 bg-emerald-400 w-16 sm:w-32 rounded-full -mt-6"></div>
        
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#0f2b5c] text-white font-bold flex items-center justify-center border-4 border-blue-50 shadow-sm">
            2
          </div>
          <span className="text-xs font-bold text-[#0f2b5c]">Захиалга</span>
        </div>
        
        <div className="h-0.5 bg-slate-200 w-16 sm:w-32 rounded-full -mt-6 hidden sm:block"></div>
        
        <div className="hidden sm:flex flex-col items-center gap-2 opacity-50 grayscale">
          <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 font-bold flex items-center justify-center border-4 border-white">
            3
          </div>
          <span className="text-xs font-bold text-slate-500">Төлбөр</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Content (Left side - 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* User Status Banner */}
          {!session?.user ? (
            <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 text-blue-900">
                <User className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Та өөрийн бүртгэлээр захиалбал захиалгын түүх тань хадгалагдана.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/user/login?callbackUrl=/cart/checkout"
                  className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Нэвтрэх
                </Link>
                <Link
                  href="/user/register?callbackUrl=/cart/checkout"
                  className="px-3.5 py-1.5 bg-white text-blue-700 border border-blue-300 rounded-lg font-bold text-xs hover:bg-blue-50 transition-colors"
                >
                  Бүртгүүлэх
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-xs sm:text-sm text-emerald-900">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Нэвтэрсэн хэрэглэгч: <b>{session.user?.name || session.user?.email}</b></span>
              </div>
              <Link href="/user" className="text-xs text-emerald-700 font-bold hover:underline">
                Профайл харах
              </Link>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          {/* Contact Info Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-slate-800">Хүлээн авагчийн мэдээлэл</h3>
            </div>
            
            <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  Нэр <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={form.ner}
                    onChange={set('ner')}
                    placeholder="Таны нэр"
                    className="pl-10 w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  Утас 1 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={form.utas1}
                    onChange={set('utas1')}
                    placeholder="9911..."
                    className="pl-10 w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  Утас 2
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    value={form.utas2}
                    onChange={set('utas2')}
                    placeholder="Нэмэлт дугаар"
                    className="pl-10 w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  Хүргэх өдөр
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="date"
                    value={form.ognoo}
                    onChange={set('ognoo')}
                    min={new Date().toISOString().split('T')[0]}
                    className="pl-10 w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Хүргэх цаг
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {TIME_SLOTS.map((t) => (
                    <label
                      key={t}
                      className={`cursor-pointer px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                        form.tsag === t
                          ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tsag"
                        value={t}
                        checked={form.tsag === t}
                        onChange={set('tsag')}
                        className="hidden"
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  Хүргэлтийн хаяг <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3.5 left-3 pointer-events-none">
                    <MapPin className="h-4 w-4 text-slate-400" />
                  </div>
                  <textarea
                    required
                    rows={3}
                    value={form.hayag}
                    onChange={set('hayag')}
                    placeholder="Дүүрэг, хороо, гудамж, байр, тоот..."
                    className="pl-10 w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-y"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  Нэмэлт тайлбар
                </label>
                <textarea
                  rows={2}
                  value={form.comment}
                  onChange={set('comment')}
                  placeholder="Захиалгад үлдээх нэмэлт мэдээлэл..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-y"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-slate-800">Төлбөрийн хэлбэр</h3>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.value}
                    className={`cursor-pointer rounded-xl border p-4 flex flex-col gap-2 transition-all group ${
                      tolbor === m.value
                        ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 shadow-sm'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl group-hover:scale-110 transition-transform origin-left">{m.icon}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                        tolbor === m.value ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-white'
                      }`}>
                        {tolbor === m.value && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm leading-tight">{m.label}</div>
                      <div className="text-[11px] text-slate-500 font-medium leading-tight mt-1">{m.desc}</div>
                    </div>
                    <input
                      type="radio"
                      name="tolbor"
                      value={m.value}
                      checked={tolbor === m.value}
                      onChange={() => setTolbor(m.value)}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
          
        </div>

        {/* Order Summary (Right side - 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sticky top-28">
            <h3 className="text-lg font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">Захиалгын дүн</h3>

            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between text-slate-600">
                <span>Бараа ({items.reduce((s, i) => s + i.hed, 0)} ширхэг)</span>
                <span className="font-bold text-slate-800">{formatPrice(subtotal())}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Хүргэлт</span>
                <span className="font-bold text-slate-800">{deliveryUne > 0 ? formatPrice(deliveryUne) : 'Үнэгүй'}</span>
              </div>
              {noat && (
                <div className="flex justify-between text-slate-600">
                  <span>НӨАТ (10%)</span>
                  <span className="font-bold text-slate-800">{formatPrice(Math.floor(subtotal() * 0.1))}</span>
                </div>
              )}
            </div>

            {/* Compact Item List */}
            <div className="mt-6 mb-6 bg-slate-50 rounded-xl p-4 space-y-3 text-xs font-medium border border-slate-100">
              {items.map((item) => (
                <div key={`${item.productId}-${item.songolt}`} className="flex justify-between gap-3">
                  <div className="text-slate-600 line-clamp-2 leading-snug">
                    {item.title} {item.songolt && <span className="text-slate-400">({item.songolt})</span>}
                  </div>
                  <div className="font-bold text-slate-800 whitespace-nowrap">x{item.hed}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-6 flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Нийт төлөх дүн</span>
                <span className="text-2xl font-black text-[#0f2b5c]">{formatPrice(total())}</span>
              </div>
              
              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0f2b5c] hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-70 disabled:hover:bg-[#0f2b5c] disabled:transform-none"
              >
                <span>{submitting ? 'Түр хүлээнэ үү...' : 'Захиалга баталгаажуулах'}</span>
                {!submitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="mt-6 flex items-start gap-3 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-[240px]">
                Таны хувийн мэдээлэл болон төлбөр тооцоог өндөр түвшний нууцлалтай хамгаална.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
