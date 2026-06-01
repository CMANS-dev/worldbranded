import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, createdAt: true },
    })

    let orders: { customerEmail: string | null; total: number }[] = []
    try {
      orders = await prisma.order.findMany({
        where: { status: 'paid' },
        select: { customerEmail: true, total: true },
      })
    } catch {}

    const customers = users.map(u => {
      const myOrders = orders.filter(o => o.customerEmail === u.email)
      return {
        ...u,
        _count: { orders: myOrders.length },
        totalSpent: myOrders.reduce((s, o) => s + o.total, 0),
      }
    })

    return NextResponse.json(customers)
  } catch (error: any) {
    console.error('Customers error:', error.message)
    return NextResponse.json([])
  }
}
