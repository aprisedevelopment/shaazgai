import { prisma } from '@/lib/db'
import { CategoryManager } from './CategoryManager'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { list_order: 'asc' }
  })

  const mainCategories = categories.filter(c => c.cat === 0)
  const subCategories = categories.filter(c => c.cat !== 0)

  const sortedList: any[] = []
  mainCategories.forEach(main => {
    sortedList.push({ ...main, isSub: false })
    subCategories.filter(sub => sub.cat === main.id).forEach(sub => {
      sortedList.push({ ...sub, isSub: true })
    })
  })

  return (
    <CategoryManager categories={sortedList} mainCategories={mainCategories} />
  )
}

