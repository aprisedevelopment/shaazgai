import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Нэвтрэх шаардлагатай' }, { status: 401 })
    }

    const { bid, comment, replyid = 0 } = await req.json()
    const userId = Number((session.user as any).id)
    const ner = session.user.name || 'Хэрэглэгч'

    if (!bid || !comment) {
      return NextResponse.json({ error: 'Мэдээлэл дутуу' }, { status: 400 })
    }

    const newComment = await prisma.comment.create({
      data: {
        bid: Number(bid),
        userid: userId,
        ner,
        comment,
        replyid,
        ognoo: Math.floor(Date.now() / 1000),
        ipadd: req.headers.get('x-forwarded-for') || '127.0.0.1',
      },
      include: {
        user: { select: { id: true, ner: true, image: true } }
      }
    })

    return NextResponse.json(newComment)
  } catch (error) {
    console.error('Comment error:', error)
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 })
  }
}
