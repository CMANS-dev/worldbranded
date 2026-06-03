import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendTelegram, orderNotifyMessage } from '@/lib/telegram'

const prisma = new PrismaClient()

// POST — สร้าง order ใหม่
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      orderRef, transId, ref1, amount, deliveryFee, total,
      customerName, customerEmail, phone,
      address1, address2, city, region, postal,
      items, status, paidAt,
    } = body

    const order = await prisma.order.create({
      data: {
        id: `ord_${Date.now()}`,
        orderRef,
        transId,
        ref1,
        status: status ?? 'pending',
        amount,
        deliveryFee: deliveryFee ?? 0,
        total,
        customerName,
        customerEmail,
        phone,
        address1,
        address2,
        city,
        region,
        postal,
        items: typeof items === 'string' ? items : JSON.stringify(items),
        updatedAt: new Date(),
        paidAt: paidAt ? new Date(paidAt) : null,
      },
    })

    // แจ้งเตือน Telegram
    await sendTelegram(orderNotifyMessage({
      orderRef: order.orderRef,
      customerName: order.customerName,
      customerEmail: order.customerEmail ?? undefined,
      total: order.total,
      amount: order.amount,
      deliveryFee: order.deliveryFee,
      status: order.status,
      transId: order.transId ?? undefined,
      ref1: order.ref1 ?? undefined,
      items: order.items,
    }))

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (error: any) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET — ดึง orders ทั้งหมด (admin)
export async function GET(req: Request) {
  try {
    // ถ้า table ยังไม่มีให้ return empty
    try { await prisma.order.count() } catch { return NextResponse.json({ orders: [], total: 0 }) }
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '20')

    const where = status ? { status } : {}

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({ orders, total, page, limit })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
