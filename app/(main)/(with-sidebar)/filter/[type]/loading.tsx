import { ProductCardSkeleton } from '@/components/home/ProductCard'

export default function Loading() {
  return (
    <>
      <div className="breadcrumb">
        <div style={{ width: 100, height: 16, background: 'var(--border)', borderRadius: 4 }}></div>
      </div>
      <div style={{ height: 32, width: 200, background: 'var(--border)', borderRadius: 4, marginBottom: 20 }}></div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ width: 80, height: 32, background: 'var(--border)', borderRadius: 4 }}></div>
        ))}
      </div>
      <div className="product-grid">
        {[...Array(12)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </>
  )
}
