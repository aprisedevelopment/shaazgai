import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { HeroBanner, ServiceHighlightsBar } from '@/components/home/HeroBanner'
import { HomeTabbedProducts } from '@/components/home/HomeTabbedProducts'
import type { Metadata } from 'next'

import { CategorySidebar } from '@/components/layout/CategorySidebar'
import { getFrontendCategories } from '@/lib/categories'

export const metadata: Metadata = {
  title: 'Түгээлт — Онлайн Дэлгүүр',
  description: 'Монголын онлайн дэлгүүр. Онцлох, хямдарсан, шинэ бараанууд.',
}

export const revalidate = 120

export default async function HomePage() {
  const categories = await getFrontendCategories();
  
  // NOTE: Banners are handled inside HeroBanner component now, or we can pass them down.
  // Wait, let's keep the existing logic for HeroBanner but just wrap it.
  const featured = await prisma.product.findMany({ where: { publish: 1, ontsloh: 1 }, take: 8, orderBy: { id: 'desc' } });
  const newProducts = await prisma.product.findMany({ where: { publish: 1 }, take: 8, orderBy: { nemsen: 'desc' } });
  const suggested = await prisma.product.findMany({ where: { publish: 1 }, take: 8, orderBy: { id: 'desc' } });

  return (
    <div className="space-y-8">
      {/* Top Grid: Sidebar (3 Cols) + Hero Banners (9 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Category Sidebar */}
        <div className="lg:col-span-3 hidden lg:block">
          <CategorySidebar categories={categories as any} />
        </div>

        {/* Hero Banner Slider */}
        <div className="lg:col-span-9">
          <HeroBanner />
        </div>
      </div>

      {/* Service Highlights Bar - Full Width Span */}
      <ServiceHighlightsBar />
      
      {/* Product Listing Grid */}
      {(featured.length > 0 || newProducts.length > 0 || suggested.length > 0) && (
        <HomeTabbedProducts
          initialFeatured={featured as any}
          initialNew={newProducts as any}
          initialSuggested={suggested as any}
        />
      )}
    </div>
  )
}
