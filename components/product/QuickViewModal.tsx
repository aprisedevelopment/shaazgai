'use client'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useToast } from '@/components/ui/Toast'
import { formatPrice, calcDiscount, productImageUrl } from '@/lib/utils'
import type { Product } from '@/types'
import Link from 'next/link'

export function QuickViewModal({ product, onClose }: { product: Product, onClose: () => void }) {
  const addItem = useCartStore(s => s.addItem)
  const { addToast } = useToast()
  const [adding, setAdding] = useState(false)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [])

  const discount = calcDiscount(product.une, product.unehuuchin)
  const img = productImageUrl(product.image)

  const handleAddToCart = () => {
    setAdding(true)
    addItem({
      productId: product.id,
      kod: product.kod,
      title: product.title,
      image: product.image || undefined,
      une: product.une,
      hed: qty,
    })
    addToast(`"${product.title.substring(0, 20)}..." сагсанд нэмэгдлээ`, 'success')
    setTimeout(() => {
      setAdding(false)
      onClose()
    }, 600)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      
      <div style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', 
        width: '90%', maxWidth: 800, maxHeight: '90vh', overflow: 'auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: 32,
        position: 'relative', boxShadow: 'var(--shadow-xl)'
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, width: 32, height: 32,
          borderRadius: '50%', background: 'var(--bg-section)', color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--bg-section)', position: 'relative' }}>
          <img src={img} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain', aspectRatio: '1/1' }} />
          {discount > 0 && <span className="badge-sale" style={{ top: 16, left: 16, fontSize: 13, padding: '4px 12px' }}>-{discount}%</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{product.title}</h2>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(product.une)}</span>
            {product.unehuuchin > product.une && (
              <span style={{ fontSize: 16, color: 'var(--text-light)', textDecoration: 'line-through' }}>
                {formatPrice(product.unehuuchin)}
              </span>
            )}
          </div>

          {product.duussan !== 1 ? (
            <div style={{ color: 'var(--success)', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
              ✓ Бэлэн байгаа
            </div>
          ) : (
            <div style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
              ✗ Дууссан
            </div>
          )}

          <div style={{ display: 'flex', gap: 16, marginBottom: 20, fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg> 
              Хүргэлт хийнэ
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Баталгаат бараа
            </span>
          </div>

          {product.body && (
            <div 
              style={{ 
                fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6,
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
              }}
              dangerouslySetInnerHTML={{ __html: product.body }}
            />
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
            <div style={{ display: 'flex', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', width: 120 }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ flex: 1, background: 'var(--bg-section)', border: 'none' }}>-</button>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>{qty}</div>
              <button onClick={() => setQty(qty + 1)} style={{ flex: 1, background: 'var(--bg-section)', border: 'none' }}>+</button>
            </div>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddToCart} disabled={adding || product.duussan === 1}>
              {adding ? 'Нэмж байна...' : (product.duussan === 1 ? 'Дууссан' : 'Сагслах')}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
            <span style={{ fontSize: 12, color: 'var(--text-light)', marginRight: 4 }}>Төлбөр:</span>
            <span style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, color: '#0055ff' }}>QPay</span>
            <span style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, color: '#f04e23' }}>Storepay</span>
            <span style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, color: '#009bda' }}>SocialPay</span>
            <span style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, color: '#666' }}>Visa</span>
          </div>
          
          <Link href={`/p/${product.kod}`} className="btn btn-outline" style={{ marginTop: 16, display: 'flex' }}>
            Дэлгэрэнгүй үзэх
          </Link>
        </div>

      </div>
    </div>
  )
}
