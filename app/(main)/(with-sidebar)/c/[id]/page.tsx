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

  // Бараа tatах – catvars field-д cat id агуулсан байна
  // Legacy system: catvars = "1,5,12" гэх мэт
  const products = await prisma.product.findMany({
    where: {
      publish: 1,
      OR: catIds.map((cid) => ({ catvars: { contains: String(cid) } })),
    },
    take: 24,
    orderBy: { nemsen: 'desc' },
  })

  const total = await prisma.product.count({
    where: {
      publish: 1,
      OR: catIds.map((cid) => ({ catvars: { contains: String(cid) } })),
    },
  })

  const parentCat = cat.cat ? allCats.find((c) => c.id === cat.cat) : null
  const subCats = allCats.filter((c) => c.cat === catId && c.publish === 1)

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

      {subCats.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {subCats.map((sc) => (
            <Link key={sc.id} href={`/c/${sc.id}`} className="btn btn-ghost btn-sm">{sc.title}</Link>
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
