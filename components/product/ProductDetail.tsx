'use client'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useToast } from '@/components/ui/Toast'
import { useSession } from 'next-auth/react'
import { formatPrice, calcDiscount, productImageUrl, userAvatarUrl, timeAgo } from '@/lib/utils'
import { ProductCard } from '@/components/home/ProductCard'
import type { Product, Comment } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  ChevronRight, Heart, ShoppingCart, Zap, CheckCircle2, Star, ShieldCheck, Minus, Plus, Sparkles
} from 'lucide-react'

const UPLOAD = process.env.NEXT_PUBLIC_UPLOAD_URL || '/upload'

function ProductImages({ product }: { product: Product & { photos: any[] } }) {
  const [main, setMain] = useState(product.image)
  const allPhotos = product.photos?.length
    ? product.photos
    : product.image ? [{ id: 0, image: product.image, mainphoto: 1 }] : []
  const discount = calcDiscount(product.une, product.unehuuchin)

  return (
    <div className="lg:col-span-5 space-y-4">
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-inner group">
        <Image
          src={productImageUrl(main)}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain group-hover:scale-105 transition-transform duration-500"
        />
        {discount > 0 && (
          <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-lg">
            -{discount}% ХЯМДРАЛ
          </span>
        )}
      </div>
      
      {allPhotos.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2.5">
          {allPhotos.map((ph: any) => (
            <button
              key={ph.id}
              onClick={() => setMain(ph.image)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                ph.image === main
                  ? 'border-blue-600 ring-2 ring-blue-100 scale-95 shadow-sm'
                  : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={`${UPLOAD}/baraa/small/${ph.image}`} alt="" fill sizes="100px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {product.video && (
        <div className="mt-4 rounded-xl overflow-hidden border border-slate-200">
          <video controls className="w-full">
            <source src={product.video} />
          </video>
        </div>
      )}
    </div>
  )
}

function LikeButton({ productId, likes }: { productId: number; likes: number }) {
  const [count, setCount] = useState(likes)
  const [liked, setLiked] = useState(false)

  const handleLike = async () => {
    if (liked) return
    setLiked(true)
    setCount((c) => c + 1)
    await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })
  }

  return (
    <button
      onClick={handleLike}
      className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
        liked
          ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold'
          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
      }`}
    >
      <span className="text-slate-400">Like</span>
      <span className="flex items-center gap-1">
        <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
        <span>{count}</span>
      </span>
    </button>
  )
}

function CommentSection({ productId, comments }: { productId: number; comments: Comment[] }) {
  const { data: session } = useSession()
  const [text, setText] = useState('')
  const [list, setList] = useState(comments)
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState(5)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !session) return
    setSubmitting(true)
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bid: productId, comment: text }),
    })
    if (res.ok) {
      const newComment = await res.json()
      setList((prev) => [newComment, ...prev])
      setText('')
    }
    setSubmitting(false)
  }

  return (
    <div className="space-y-6">
      {!session ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm font-bold text-blue-900">
            Сэтгэгдэл бичихийн тулд нэвтрэн үү.
          </p>
          <Link href="/user" className="bg-[#0f2b5c] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm shrink-0">
            Нэвтрэх
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase">Сэтгэгдэл үлдээх</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>
          <textarea
            rows={3}
            placeholder="Сэтгэгдэлээ бичнэ үү..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? '...' : 'Сэтгэгдэл илгээх'}
          </button>
        </form>
      )}

      {list.length > 0 ? (
        <div className="space-y-4 divide-y divide-slate-100">
          {list.map((c: any) => (
            <div key={c.id} className="pt-4 space-y-2">
              <div className="flex items-center gap-3">
                <img src={userAvatarUrl(c.user?.image)} alt="" className="w-8 h-8 rounded-full bg-slate-200 object-cover" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800">{c.user?.ner || c.ner || 'Хэрэглэгч'}</span>
                    <span className="text-xs text-slate-400">{timeAgo(c.ognoo)}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-3 h-3 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 pl-11">{c.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 py-4 text-center">Сэтгэгдэл байхгүй байна.</p>
      )}
    </div>
  )
}

export function ProductDetail({ product, comments, related }: {
  product: Product & { photos: any[] }
  comments: Comment[]
  related: Product[]
}) {
  const { addItem } = useCartStore()
  const { addToast } = useToast()
  const router = useRouter()
  const [songolt, setSongolt] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc')
  
  const vars = product.options ? product.options.split(',').map((s) => s.trim()).filter(Boolean) : []

  const handleAddCart = () => {
    if (vars.length > 0 && !songolt) {
      addToast('Та сонголтоо хийнэ үү!', 'error')
      return
    }
    addItem({ productId: product.id, kod: product.kod, title: product.title, image: product.image || undefined, une: product.une, hed: quantity, songolt: songolt || undefined })
    addToast('Сагсанд нэмэгдлээ!', 'success')
  }

  const handleBuyNow = () => {
    if (vars.length > 0 && !songolt) {
      addToast('Та сонголтоо хийнэ үү!', 'error')
      return
    }
    addItem({ productId: product.id, kod: product.kod, title: product.title, image: product.image || undefined, une: product.une, hed: quantity, songolt: songolt || undefined })
    router.push('/cart')
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Breadcrumb Nav */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium bg-white px-4 py-3 rounded-xl border border-slate-200/80 shadow-sm overflow-hidden whitespace-nowrap overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-blue-600 transition-colors">Нүүр</Link>
        <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
        <span className="text-[#0f2b5c] font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Display Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <ProductImages product={product} />

        {/* Right Column: Details (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-snug">
              {product.title}
            </h1>

            {/* Price & Availability Pill */}
            <div className="flex items-center gap-4 flex-wrap bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#0f2b5c]">
                  {formatPrice(product.une)}
                </span>
                {product.unehuuchin > product.une && (
                  <span className="text-sm sm:text-base text-slate-400 line-through font-normal">
                    {formatPrice(product.unehuuchin)}
                  </span>
                )}
              </div>

              {product.duussan !== 1 ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Бэлэн байгаа</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-full border border-rose-200">
                  <span>✗ Дууссан</span>
                </span>
              )}
            </div>

            {/* Info Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-medium text-slate-600">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-400">Код</span>
                <span className="font-bold text-slate-800">{product.kod}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between col-span-2 sm:col-span-1">
                <span className="text-slate-400">Хүргэлт</span>
                <span className="font-bold text-emerald-600">
                  {product.hurgelt === 1 ? 'Үнэгүй' : 'Хэвийн'}
                </span>
              </div>
            </div>

            {/* Variants */}
            {vars.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Сонголт: <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {vars.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSongolt(v)}
                      className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${
                        songolt === v 
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:bg-slate-50'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Тоо ширхэг:</span>
              <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-slate-200 font-bold flex items-center justify-center transition-colors shadow-sm"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-sm font-extrabold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-slate-200 font-bold flex items-center justify-center transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          {product.duussan !== 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleAddCart}
                className="bg-[#0f2b5c] hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>+ Сагсанд нэмэх</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-[#f97316] hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                <Zap className="w-5 h-5" />
                <span>Шууд авах</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="flex items-center border-b border-slate-200 bg-slate-50 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('desc')}
            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'desc'
                ? 'border-[#0f2b5c] text-[#0f2b5c] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Дэлгэрэнгүй мэдээлэл
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-[#0f2b5c] text-[#0f2b5c] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Сэтгэгдэл ({comments.length})</span>
          </button>
        </div>

        <div className="p-6 lg:p-8">
          {activeTab === 'desc' && (
            <div className="space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
              {product.body ? (
                <div dangerouslySetInnerHTML={{ __html: product.body }} className="prose max-w-none" />
              ) : (
                <p>Тайлбар олдсонгүй.</p>
              )}
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-3 text-xs sm:text-sm text-blue-900 mt-6">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">100% Баталгаат чанар</p>
                  <p className="text-blue-700/80 mt-0.5">
                    Tugeelt.mn дээрх бүх бараа үйлдвэрийн албан ёсны чанарын шаардлага хангасан бөгөөд гэмтэлтэй тохиолдолд 24 цагийн дотор солиулах боломжтой.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <CommentSection productId={product.id} comments={comments} />
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-black text-[#0f2b5c]">Санал болгох бараа</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((rec) => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
