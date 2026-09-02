import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const banners = [
      { title: 'Featured Products', image: 'featured.png', holboos: '1', cat: 3, publish: 1 },
      { title: 'Discounted Sale', image: 'discount.png', holboos: '2', cat: 3, publish: 1 },
      { title: 'New Arrivals', image: 'new.png', holboos: '3', cat: 3, publish: 1 },
      { title: 'Best Sellers', image: 'best.png', holboos: '4', cat: 3, publish: 1 },
      { title: 'Free Delivery', image: 'delivery.png', holboos: '5', cat: 3, publish: 1 },
    ]

    for (const b of banners) {
      await prisma.banner.create({
        data: b
      })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
