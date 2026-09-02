import { prisma } from '@/lib/db'
import { ProductCard } from '@/components/home/ProductCard'
import { InfiniteProducts } from '@/components/home/InfiniteProducts'
import { FilterBanner } from '@/components/home/FilterBanner'
import { FILTER_LABELS, type FilterType } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params
  const label = FILTER_LABELS[type as FilterType] || 'Бараа'
  return { title: label, description: `${label} - Tugeelt.mn` }
}

export const revalidate = 120

function getFilterWhere(type: string) {
  switch (type) {
    case '1': return { ontsloh: 1 }
    case '2': return { unehuuchin: { gt: 0 } }
    case '3': return {}
    case '4': return { id: { gt: 0 } }
    case '5': return { hurgelt: 1 }
    default:  return {}
  }
}

function getFilterOrder(type: string): any {
  switch (type) {
    case '2': return { une: 'asc' }
    case '3': return { nemsen: 'desc' }
    case '4': return { id: 'desc' }
    default:  return { id: 'desc' }
  }
}

export default async function FilterPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  const label = FILTER_LABELS[type as FilterType] || 'Бараа'
  const where = { publish: 1, ...getFilterWhere(type) }
  const orderBy = getFilterOrder(type)

  const [products, total, banners] = await Promise.all([
    prisma.product.findMany({ where, take: 24, orderBy }),
    prisma.product.count({ where }),
    prisma.banner.findMany({ where: { cat: 3, publish: 1, holboos: type }, orderBy: { id: 'asc' } })
  ])

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">Нүүр</Link>
        <span className="breadcrumb-sep">›</span>
        <span>{label}</span>
      </div>

      <FilterBanner banners={banners as any} />

      <h1 className="section-title">
        {label}
        <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)' }}>{total} бараа</span>
      </h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {Object.entries(FILTER_LABELS).map(([k, v]) => (
          <Link
            key={k}
            href={`/filter/${k}`}
            className={`btn btn-sm ${k === type ? 'btn-primary' : 'btn-ghost'}`}
          >{v}</Link>
        ))}
      </div>

      <InfiniteProducts
        type="filter"
        filterType={type}
        initialProducts={products as any}
        initialLastId={products[products.length - 1]?.id}
      />
    </>
  )
}
