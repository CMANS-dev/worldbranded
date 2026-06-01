import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendTelegram, orderNotifyMessage } from '@/lib/telegram'

const prisma = new PrismaClient()

/*
  12Group Callback spec (doc p.10):

  POST body (JSON):
  {
    "resp_code": 200,
    "resp_msg": "Success",
    "command": "Payment",
    "bank_ref": "INET-BANK 47157233",
    "tranx_id": "...",
    "one2pay_ref": "...",
    "datetime": "20220407080916",
    "effdate": "20220407",
    "amount": 100,
    "cusname": "...",
    "ref1": "306689239370",   ← ใช้ map กลับมาหา order
    "ref2": "...",
    "ref3": "...",
    "ref4": "...",
    "trans_id": "...",
    "aml_status": "Approved" | "Pending" | "Rejected"
    "aml_check": "Match" | "Not Match"
  }

  Required response:
  { "code": 200, "Message": "Success" }
*/

export async function POST(req: Request) {
  try {
    const body = await req.json()

    console.log('🔔 Payment callback received:', JSON.stringify(body, null, 2))

    const {
      resp_code,
      trans_id,
      tranx_id,
      ref1,
      amount,
      cusname,
      aml_status,
      aml_check,
      datetime,
    } = body

    // ถ้า resp_code ไม่ใช่ 200 ไม่ต้องทำอะไร
    if (resp_code !== 200) {
      return NextResponse.json({ code: 200, Message: 'Success' })
    }

    // map order status ตาม aml_status
    let orderStatus = 'pending'
    if (aml_status === 'Approved') orderStatus = 'paid'
    else if (aml_status === 'Rejected') orderStatus = 'failed'
    else if (aml_status === 'Pending') orderStatus = 'aml_pending'

    // หา order จาก ref1 (ที่เราส่งไปตอนสร้าง QR)
    const order = await prisma.order.findFirst({
      where: { ref1 },
    })

    if (order) {
      const updated = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: orderStatus,
          transId: trans_id ?? order.transId,
          paidAt: aml_status === 'Approved' ? new Date() : null,
        },
      })
      console.log(`✅ Order ${updated.orderRef} updated → ${orderStatus}`)

      // แจ้งเตือน Telegram
      await sendTelegram(orderNotifyMessage({
        orderRef: updated.orderRef,
        customerName: updated.customerName,
        total: updated.total,
        amount: updated.amount,
        deliveryFee: updated.deliveryFee,
        status: orderStatus,
        amlStatus: aml_status,
        transId: trans_id,
        items: updated.items,
      }))
    } else {
      // ไม่พบ order — สร้างใหม่จาก callback data
      console.warn(`⚠️ Order not found for ref1=${ref1}, creating from callback`)
      await prisma.order.create({
        data: {
          orderRef: `CB-${ref1}`,
          transId: trans_id,
          ref1,
          status: orderStatus,
          amount: amount ?? 0,
          deliveryFee: 0,
          total: amount ?? 0,
          customerName: cusname ?? '',
          items: '[]',
          paidAt: aml_status === 'Approved' ? new Date() : null,
        },
      })
    }

    // ต้อง response กลับแบบนี้เสมอ ไม่งั้น 12Group จะ retry
    return NextResponse.json({ code: 200, Message: 'Success' })
  } catch (error) {
    console.error('Webhook error:', error)
    // ส่ง 200 กลับเสมอเพื่อไม่ให้ retry ซ้ำ แต่ log error ไว้
    return NextResponse.json({ code: 200, Message: 'Success' })
  }
}
