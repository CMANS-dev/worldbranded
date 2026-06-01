import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [allOrders, paidOrders, pendingOrders, todayOrders] = await Promise.all([
      prisma.order.findMany({ select: { total: true, status: true } }),
      prisma.order.count({ where: { status: 'paid' } }),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.findMany({ where: { createdAt: { gte: today } }, select: { total: true, status: true } }),
    ])

    const totalRevenue = allOrders.filter(o => o.status === 'paid').reduce((s, o) => s + o.total, 0)
    const todayRevenue = todayOrders.filter(o => o.status === 'paid').reduce((s, o) => s + o.total, 0)

    return NextResponse.json({
      totalOrders: allOrders.length,
      paidOrders,
      pendingOrders,
      totalRevenue,
      todayOrders: todayOrders.length,
      todayRevenue,
    })
  } catch (error: any) {
    console.error('Stats error:', error.message)
    return NextResponse.json({
      totalOrders: 0, paidOrders: 0, pendingOrders: 0,
      totalRevenue: 0, todayOrders: 0, todayRevenue: 0,
    })
  }
}
