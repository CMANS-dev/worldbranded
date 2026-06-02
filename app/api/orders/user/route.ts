import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    if (!email) return NextResponse.json({ orders: [] })

    try { await prisma.order.count() } catch { return NextResponse.json({ orders: [] }) }

    const orders = await prisma.order.findMany({
      where: { customerEmail: email },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ orders })
  } catch {
    return NextResponse.json({ orders: [] })
  }
}
