import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'
import { sendTelegram, orderNotifyMessage } from '@/lib/telegram'

const prisma = new PrismaClient()

const sanityWrite = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

// POST — สร้าง order ใหม่ หรือ update status ถ้ามี orderRef อยู่แล้ว
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      orderRef, transId, ref1, status, amount, deliveryFee, discountAmount, couponCode, total,
      customerName, customerEmail, phone,
      address1, address2, city, region, postal,
      items, paidAt,
    } = body

    const existing = await prisma.order.findFirst({ where: { orderRef } })

    let order

    if (existing) {
      // มีอยู่แล้ว — update เฉพาะ status/transId/paidAt
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
          id: `ord_${Date.now()}`,
          orderRef,
          transId,
          ref1,
          status: status ?? 'pending',
          amount,
          deliveryFee: deliveryFee ?? 0,
          discountAmount: discountAmount ?? 0,
          couponCode: couponCode ?? null,
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
          updatedAt: new Date(),
          paidAt: paidAt ? new Date(paidAt) : null,
        },
      })
    }

    // increment usedCount ใน Sanity เมื่อ order สำเร็จ (paid) และมี coupon
    const couponToCount = couponCode ?? existing?.couponCode
    if (status === 'paid' && couponToCount && process.env.SANITY_API_WRITE_TOKEN) {
      try {
        const coupon = await sanityWrite.fetch(
          `*[_type == "coupon" && code == $code][0]{ _id, usedCount }`,
          { code: couponToCount },
        )
        if (coupon?._id) {
          await sanityWrite
            .patch(coupon._id)
            .set({ usedCount: (coupon.usedCount ?? 0) + 1 })
            .commit()
        }
      } catch (e) {
        console.error('Increment coupon usedCount error:', e)
      }
    }

    // แจ้ง Telegram
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
