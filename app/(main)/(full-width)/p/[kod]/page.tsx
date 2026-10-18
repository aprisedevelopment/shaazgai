import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ProductDetail } from '@/components/product/ProductDetail'
import { productImageUrl } from '@/lib/utils'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ kod: string }> }): Promise<Metadata> {
  const { kod } = await params
  const p = await prisma.product.findUnique({ where: { kod } })
  if (!p) return { title: 'Бараа олдсонгүй' }
  return {
    title: p.title,
    description: p.body?.replace(/<[^>]+>/g, '').substring(0, 160),
    openGraph: { images: p.image ? [productImageUrl(p.image)] : [] },
  }
}

export const revalidate = 60

export default async function ProductPage({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params
  const product = await prisma.product.findUnique({
    where: { kod },
    include: { photos: true },
  })
  if (!product) notFound()

  const [comments, related] = await Promise.all([
    prisma.comment.findMany({
      where: { bid: product.id, replyid: 0 },
      orderBy: { ognoo: 'desc' },
      take: 20,
      include: { user: { select: { id: true, ner: true, image: true } } },
    }),
    prisma.product.findMany({
      where: { publish: 1, id: { not: product.id } },
      take: 12,
      orderBy: { id: 'desc' },
    }),
  ])

  return <ProductDetail product={product as any} comments={comments as any} related={related as any} />
}
