import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ProductCard } from '@/components/home/ProductCard'
import { InfiniteProducts } from '@/components/home/InfiniteProducts'
import type { Metadata } from 'next'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const cat = await prisma.category.findUnique({ where: { id: Number(id) } })
  if (!cat) return { title: 'Ангилал олдсонгүй' }
  return { title: cat.title, description: `${cat.title} - Tugeelt.mn дэлгүүр` }
}

export const revalidate = 120

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const catId = Number(id)
  const cat = await prisma.category.findUnique({ where: { id: catId } })
  if (!cat) notFound()

  // Get all subcategory IDs for filtering
  const allCats = await prisma.category.findMany({ where: { publish: 1 } })
  const getCatIds = (parentId: number): number[] => {
    const children = allCats.filter((c) => c.cat === parentId)
    return [parentId, ...children.flatMap((c) => getCatIds(c.id))]
  }
  const catIds = getCatIds(catId)

  // Бараа татах – catvars field-д :catId: байдлаар хадгалагддаг
  const catFilterOr = catIds.flatMap((cid) => [
    { catvars: { contains: `:${cid}:` } },
    { catvars: { equals: String(cid) } },
  ])

  const products = await prisma.product.findMany({
    where: {
      publish: 1,
      OR: catFilterOr,
    },
    take: 24,
    orderBy: { nemsen: 'desc' },
  })

  const total = await prisma.product.count({
    where: {
      publish: 1,
      OR: catFilterOr,
    },
  })

  const parentCat = cat.cat ? allCats.find((c) => c.id === cat.cat) : null
  const subCats = allCats.filter((c) => c.cat === catId && c.publish === 1)

  // Зөвхөн бараатай дэд ангиллуудыг харуулах
  const subCatsWithProducts = await Promise.all(
    subCats.map(async (sc) => {
      const scIds = getCatIds(sc.id)
      const count = await prisma.product.count({
        where: {
          publish: 1,
          OR: scIds.flatMap((cid) => [
            { catvars: { contains: `:${cid}:` } },
            { catvars: { equals: String(cid) } },
          ]),
        },
      })
      return { ...sc, count }
    })
  )
  const visibleSubCats = subCatsWithProducts.filter((sc) => sc.count > 0)

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">Нүүр</Link>
        <span className="breadcrumb-sep">›</span>
        {parentCat && (
          <>
            <Link href={`/c/${parentCat.id}`}>{parentCat.title}</Link>
            <span className="breadcrumb-sep">›</span>
          </>
        )}
        <span>{cat.title}</span>
      </div>

      <h1 className="section-title">{cat.title}
        <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)' }}>{total} бараа</span>
      </h1>

      {visibleSubCats.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {visibleSubCats.map((sc) => (
            <Link key={sc.id} href={`/c/${sc.id}`} className="btn btn-ghost btn-sm">
              {sc.title} <span style={{ opacity: 0.6, fontSize: 11, marginLeft: 4 }}>({sc.count})</span>
            </Link>
          ))}
        </div>
      )}

      <InfiniteProducts
        type="cat"
        catIds={catIds}
        initialProducts={products as any}
        initialLastId={products[products.length - 1]?.id}
      />
    </>
  )
}
