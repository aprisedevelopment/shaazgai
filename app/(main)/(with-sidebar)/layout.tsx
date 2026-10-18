import { CategorySidebar } from '@/components/layout/CategorySidebar'
import { getFrontendCategories } from '@/lib/categories'
import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

const getBanners = unstable_cache(
  async () => prisma.banner.findMany({ where: { cat: 2, publish: 1 }, orderBy: { title: 'asc' } }),
  ['layout-banners'],
  { revalidate: 3600, tags: ['banners'] }
)

export default async function SidebarLayout({ children }: { children: React.ReactNode }) {
  const categories = await getFrontendCategories();
  const rightBanners = await getBanners();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <aside className="lg:col-span-3 hidden lg:block sticky top-[92px] h-[calc(100vh-100px)] overflow-y-auto no-scrollbar">
        <CategorySidebar categories={categories} />
      </aside>
      <main className="lg:col-span-9 space-y-8">
        {children}
      </main>
    </div>
  )
}
