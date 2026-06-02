import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendTelegram, orderNotifyMessage } from '@/lib/telegram'

const prisma = new PrismaClient()

// POST — สร้าง order ใหม่ หรือ update status ถ้ามี orderRef อยู่แล้ว
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      orderRef, transId, ref1, status, amount, deliveryFee, total,
      customerName, customerEmail, phone,
      address1, address2, city, region, postal,
      items, paidAt,
    } = body

    const existing = await prisma.order.findFirst({ where: { orderRef } })

    let order

    if (existing) {
      // มีอยู่แล้ว — update เฉพาะ status/transId/paidAt
      // ไม่ทับข้อมูล customer/address ที่มีอยู่
      order = await prisma.order.update({
        where: { id: existing.id },
        data: {
          status,
          transId: transId ?? existing.transId,
          paidAt: paidAt ? new Date(paidAt) : existing.paidAt,
        },
      })
    } else {
      // ยังไม่มี — สร้างใหม่
      order = await prisma.order.create({
        data: {
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
          items: typeof items === 'string' ? items : JSON.stringify(items ?? []),
          paidAt: paidAt ? new Date(paidAt) : null,
        },
      })
    }

    // แจ้ง Telegram ทุกครั้งที่ status เปลี่ยน
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
    }))

    return NextResponse.json({ success: true, order }, { status: 200 })
  } catch (error: any) {
    console.error('Upsert order error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
