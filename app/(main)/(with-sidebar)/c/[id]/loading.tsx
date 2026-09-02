import { ProductCardSkeleton } from '@/components/home/ProductCard'

export default function Loading() {
  return (
    <>
      <div className="breadcrumb">
        <div style={{ width: 100, height: 16, background: 'var(--border)', borderRadius: 4 }}></div>
      </div>
      <div style={{ height: 32, width: 200, background: 'var(--border)', borderRadius: 4, marginBottom: 20 }}></div>
      <div className="product-grid">
        {[...Array(12)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </>
  )
}
