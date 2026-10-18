import { prisma } from '@/lib/db'
import { PageManager } from './PageManager'

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({
    orderBy: { list_order: 'asc' }
  })

  return (
    <PageManager pages={pages} />
  )
}

