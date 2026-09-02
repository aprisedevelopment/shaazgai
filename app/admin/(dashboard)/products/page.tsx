import { prisma } from '@/lib/db'
import Link from 'next/link'
import { ProductFilters } from './ProductFilters'
import { ProductTable } from './ProductTable'

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; cat?: string; status?: string; featured?: string }> }) {
  const { page, q, cat, status, featured } = await searchParams
  const currentPage = Number(page) || 1
  const perPage = 20

  const where: any = {}
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { kod: { contains: q } }
    ]
  }
  if (cat) {
    where.catvars = { contains: `-${cat}-` }
  }
  if (status === 'out_of_stock') where.duussan = 1
  if (status === 'active') where.publish = 1
  if (status === 'inactive') where.publish = 0
  if (status === 'low_stock') {
    where.uldegdel = { gt: 0, lt: 5 }
  }
  if (featured === '1') where.ontsloh = 1

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { id: 'desc' },
      skip: (currentPage - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { publish: 1 }, orderBy: { title: 'asc' } })
  ])

  const mainCategories = categories.filter(c => c.cat === 0)
  const subCategories = categories.filter(c => c.cat !== 0)
  const sortedCategories: any[] = []
  mainCategories.forEach(main => {
    sortedCategories.push({ ...main, isSub: false })
    subCategories.filter(sub => sub.cat === main.id).forEach(child => {
      sortedCategories.push({ ...child, isSub: true })
    })
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Бараанууд</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <ProductFilters categories={sortedCategories} />
          <Link href="/admin/products/new" className="btn btn-primary" style={{ height: 38, display: 'flex', alignItems: 'center' }}>+ Бараа нэмэх</Link>
        </div>
      </div>

      <ProductTable products={products} categories={sortedCategories} />
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
        {Array.from({ length: Math.ceil(total / perPage) }).map((_, i) => {
          const qs = new URLSearchParams()
          qs.set('page', String(i + 1))
          if (q) qs.set('q', q)
          if (cat) qs.set('cat', cat)
          if (status) qs.set('status', status)
          if (featured) qs.set('featured', featured)
          
          return (
            <a key={i} href={`?${qs.toString()}`} className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}>
              {i + 1}
            </a>
          )
        })}
      </div>
    </>
  )
}
