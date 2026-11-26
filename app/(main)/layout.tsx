import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

const getPages = unstable_cache(
  async () => prisma.page.findMany({ where: { publish: 1 }, orderBy: { list_order: 'asc' } }),
  ['layout-pages'],
  { revalidate: 3600, tags: ['pages'] }
)

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const pages = await getPages()

  return (
    <div className="min-h-screen bg-[#f3f5f8] text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white print:bg-white print:block print:min-h-0">
      <Header pages={pages} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 print:max-w-none print:p-0 print:m-0 print:space-y-0">
        {children}
      </main>
      <Footer pages={pages} />
      <MobileNav />
    </div>
  )
}
