import { prisma } from '@/lib/db'
import { BannerManager } from './BannerManager'

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { id: 'desc' }
  })

  return (
    <BannerManager banners={banners} />
  )
}

