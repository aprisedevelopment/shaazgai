import { prisma } from '@/lib/db'
import { getAllCategoriesForAdmin } from '@/lib/categories'
import { CategoryManager } from './CategoryManager'

export const revalidate = 60

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesForAdmin()
  const rawMain = await prisma.category.findMany({
    where: { cat: 0 },
    orderBy: { list_order: 'asc' }
  })

  return (
    <CategoryManager categories={categories} mainCategories={rawMain as any} />
  )
}
