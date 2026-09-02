import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const lastId = searchParams.get('lastId')
    const catIds = searchParams.get('catIds')
    const filterType = searchParams.get('filterType')
    const q = searchParams.get('q')

    const cursor = lastId ? { id: Number(lastId) } : undefined
    const skip = cursor ? 1 : 0
    const take = Number(searchParams.get('take')) || 24
    
    let where: any = { publish: 1 }
    let orderBy: any = { id: 'desc' }

    if (type === 'cat' && catIds) {
      const ids = catIds.split(',').map(Number)
      where.OR = ids.map(cid => ({ catvars: { contains: `,${cid},` } }))
      orderBy = { nemsen: 'desc' }
    } else if (type === 'search' && q) {
      where.OR = [
        { title: { contains: q } },
        { kod: { contains: q } },
        { body: { contains: q } },
      ]
      orderBy = { id: 'desc' }
    } else if (type === 'filter' && filterType) {
      switch (filterType) {
        case '1': where.ontsloh = 1; break;
        case '2': where.unehuuchin = { gt: 0 }; orderBy = { une: 'asc' }; break;
        case '3': orderBy = { nemsen: 'desc' }; break;
        case '4': where.id = { gt: 0 }; orderBy = { id: 'desc' }; break;
        case '5': where.hurgelt = 1; break;
      }
    }

    const items = await prisma.product.findMany({
      where,
      take,
      skip,
      cursor,
      orderBy,
    })

    return NextResponse.json({
      items,
      lastId: items.length === take ? items[items.length - 1].id : null,
      hasMore: items.length === take,
    })
  } catch (error) {
    console.error('Load more error:', error)
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 })
  }
}
