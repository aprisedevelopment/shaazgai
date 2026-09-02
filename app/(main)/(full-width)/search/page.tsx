import { prisma } from '@/lib/db'
import { ProductCard } from '@/components/home/ProductCard'
import { InfiniteProducts } from '@/components/home/InfiniteProducts'
import { SearchInput } from '@/components/search/SearchInput'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q } = await searchParams
  return { title: q ? `"${q}" хайлтын үр дүн` : 'Хайлт' }
}

const POPULAR_SEARCHES = ['Ухаалаг цаг', 'Чихэвч', 'Цүнх', 'Гэр ахуй', 'Гоо сайхан', 'Бэлэг']

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const query = q?.trim() || ''

  if (!query) {
    const suggestions = await prisma.product.findMany({
      where: { publish: 1 },
      take: 6,
      orderBy: { id: 'desc' },
    })

    return (
      <div style={{ maxWidth: 800, margin: '0 auto', paddingTop: 16 }}>
        <h1 className="section-title" style={{ textAlign: 'center', marginBottom: 24 }}>Хайлт</h1>
        <SearchInput />

        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 12 }}>Түгээмэл хайлтууд</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {POPULAR_SEARCHES.map(tag => (
              <Link 
                key={tag} 
                href={`/search?q=${encodeURIComponent(tag)}`}
                style={{ 
                  padding: '8px 16px', 
                  background: 'var(--bg-section)', 
                  borderRadius: 20, 
                  fontSize: 13,
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  textDecoration: 'none'
                }}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="section-title">Санал болгож буй бараанууд</h2>
          <div className="product-grid">
            {suggestions.map((p) => <ProductCard key={p.id} product={p as any} />)}
          </div>
        </div>
      </div>
    )
  }

  const products = await prisma.product.findMany({
    where: {
      publish: 1,
      OR: [
        { title: { contains: query } },
        { kod: { contains: query } },
        { body: { contains: query } },
      ],
    },
    take: 24,
    orderBy: { id: 'desc' },
  })

  const total = await prisma.product.count({
    where: {
      publish: 1,
      OR: [
        { title: { contains: query } },
        { kod: { contains: query } },
        { body: { contains: query } },
      ],
    },
  })

  let suggestions: any[] = []
  if (products.length === 0) {
    suggestions = await prisma.product.findMany({
      where: { publish: 1 },
      take: 6,
      orderBy: { id: 'desc' },
    })
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingTop: 16 }}>
      <SearchInput />
      
      <h1 className="section-title" style={{ marginTop: 20 }}>
        &ldquo;{query}&rdquo; хайлтын үр дүн
        <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>{total} бараа олдлоо</span>
      </h1>

      {products.length === 0 ? (
        <div style={{ marginTop: 40 }}>
          <div className="box text-center" style={{ padding: 48, marginBottom: 40 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p className="text-muted" style={{ fontSize: 16 }}>&ldquo;{query}&rdquo; хайлтаар бараа олдсонгүй.</p>
          </div>

          <h2 className="section-title">Бусад хүмүүсийн сонирхож буй бараанууд</h2>
          <div className="product-grid">
            {suggestions.map((p) => <ProductCard key={p.id} product={p as any} />)}
          </div>
        </div>
      ) : (
        <>
          <InfiniteProducts
            type="search"
            searchQuery={query}
            initialProducts={products as any}
            initialLastId={products[products.length - 1]?.id}
          />
        </>
      )}
    </div>
  )
}
