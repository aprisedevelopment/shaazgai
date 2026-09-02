import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const zones = await prisma.deliveryZone.findMany({
      orderBy: { id: 'asc' }
    })
    return NextResponse.json(zones)
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 })
  }
}
