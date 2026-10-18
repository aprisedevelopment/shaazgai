import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag, ArrowLeft, Package, Clock, MapPin, CreditCard, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react'

export default async function UserOrdersPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/user/login?callbackUrl=/user/orders')
  }

  const userId = Number((session.user as any).id)
  if (isNaN(userId)) {
    redirect('/user/login')
  }

  const orders = await prisma.order.findMany({
    where: { sesid: String(userId) },
    include: {
      details: true,
    },
    orderBy: { id: 'desc' },
  })

  const getStatusBadge = (tolov?: string | number | null) => {
    const s = String(tolov ?? '')
    if (s === '1') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Хүргэгдсэн
        </span>
      )
    }
    if (s === '2') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5" />
          Цуцлагдсан
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3.5 h-3.5" />
        Хүлээгдэж буй
      </span>
    )
  }

  const getPaymentMethod = (helber?: string | number | null) => {
    const h = String(helber ?? '')
    switch (h) {
      case '1': return 'Бэлнээр'
      case '2': return 'Дансаар шилжүүлэх'
      case '4': return 'QPay'
      case '5': return 'Голомт Карт'
      case '6': return 'SocialPay'
      case '7': return 'HiPay'
      case '8': return 'LendMN'
      default: return 'Бусад'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in py-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <Link href="/user" className="hover:text-blue-600 transition-colors">Хувийн танхим</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-700">Миний захиалгууд</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            Миний захиалгын түүх
          </h1>
        </div>

        <Link
          href="/user"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Профайл руу буцах
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-16 text-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Танд одоогоор хийсэн захиалга байхгүй байна</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
            Манай дэлгүүрээс өөрт хэрэгцээтэй бараагаа сонгон захиалга хийгээрэй.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#0f2b5c] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all text-sm"
          >
            Бараа үзэх
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              {/* Order Header */}
              <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-mono font-black text-slate-900 text-base">
                      Захиалга #{o.zid || o.id}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {o.ognoo} {o.tsag || ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(o.tolov)}
                  <div className="text-right pl-3 border-l border-slate-200">
                    <div className="text-xs text-slate-400 uppercase font-bold">Нийт дүн</div>
                    <div className="text-base sm:text-lg font-black text-blue-600 font-mono">
                      {o.niitdun ? formatPrice(Number(o.niitdun)) : '-'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Details Body */}
              <div className="p-4 sm:p-5 space-y-4">
                
                {/* Items List */}
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {o.details && o.details.length > 0 ? (
                    o.details.map((item) => (
                      <div key={item.id} className="p-3 bg-white flex items-center justify-between gap-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-3 min-w-0">
                          {item.kod && (
                            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold shrink-0">
                              {item.kod}
                            </span>
                          )}
                          <div className="truncate font-bold text-slate-800">
                            {item.title || `Бараа #${item.bid}`}
                            {item.songolt && (
                              <span className="text-xs font-normal text-slate-500 ml-2">
                                ({item.songolt})
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 text-right">
                          <span className="text-slate-500 font-mono text-xs">
                            {item.hed} ширхэг
                          </span>
                          <span className="font-mono font-bold text-slate-800">
                            {formatPrice(item.une * item.hed)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-slate-400 text-center">
                      Барааны дэлгэрэнгүй бүртгэгдээгүй байна
                    </div>
                  )}
                </div>

                {/* Delivery & Payment Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100 text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-700">Хүргэх хаяг: </span>
                      {o.hayag}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:justify-end">
                    <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-700">Төлбөрийн хэлбэр: </span>
                      {getPaymentMethod(o.tolbor_helber)}
                    </div>
                  </div>
                </div>

                {/* Bank Transfer Notice if unpaid */}
                {String(o.tolbor_helber) === '2' && String(o.tolbor_tolson) !== '1' && (
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between gap-3">
                    <div>
                      Шилжүүлэг хийх: <b>Хаан банк 5059103999 (Т.Өлзийбаяр)</b> | Гүйлгээний утга: <b>{o.zid || o.id}</b>
                    </div>
                    <Link
                      href={`/cart/payment?h=2&zid=${o.zid || o.id}`}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shrink-0 transition-colors"
                    >
                      Дансны заавар харах
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
