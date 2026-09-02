import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { ner, email, utas, pass } = await req.json()

    if (!ner || !email || !pass) {
      return NextResponse.json({ success: false, error: 'Мэдээллээ бүрэн оруулна уу' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ success: false, error: 'Имэйл хаяг бүртгэлтэй байна' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(pass, 12)
    const now = Math.floor(Date.now() / 1000)

    const user = await prisma.user.create({
      data: {
        ner,
        email,
        utas,
        pass: hashedPassword,
        active: 1,
        huis: 0,
        hyamdral: 0,
        ajiltan: 0,
        torol: 1,
        regognoo: now
      }
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ success: false, error: 'Алдаа гарлаа' }, { status: 500 })
  }
}
