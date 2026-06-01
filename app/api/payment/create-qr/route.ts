import { NextResponse } from 'next/server'
import { sendTelegram } from '@/lib/telegram'

export async function POST(req: Request) {
  try {
    const { amount, ref1, ref3, orderId } = await req.json()

    if (!amount || !ref1 || !ref3) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const res = await fetch(
      `https://${process.env.PAYMENT_URL}/${process.env.PAYMENT_VERSION}/create-qr-code`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'channel': 'WEB',
          'partner_code': process.env.PAYMENT_PARTNER_CODE!,
          'authorization': process.env.PAYMENT_AUTHORIZATION!,
        },
        body: JSON.stringify({
          amount,
          ref1,
          ref2: '',
          ref3,
        }),
      }
    )

    const rawText = await res.text()
    console.log('🟡 Gateway URL:', `https://${process.env.PAYMENT_URL}/${process.env.PAYMENT_VERSION}/create-qr-code/`)
    console.log('🟡 Gateway status:', res.status)
    console.log('🟡 Gateway raw response:', rawText)

    let data: any
    try { data = JSON.parse(rawText) } catch {
      return NextResponse.json({ error: 'Gateway returned non-JSON', raw: rawText }, { status: 502 })
    }

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status })
    }

    // แจ้งเตือนกลุ่มว่ามีออเดอร์ใหม่
    await sendTelegram(
      `🛒 <b>New Order Placed</b>\n\n` +
      `👤 ${ref3}\n` +
      `💰 ฿${Number(amount).toLocaleString()}\n` +
      `🔑 Ref: <code>${ref1}</code>\n` +
      `🕐 ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}\n\n` +
      `⏳ รอการชำระเงิน...`
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error('Payment create-qr error:', error)
    return NextResponse.json({ error: 'Failed to create QR' }, { status: 500 })
  }
}
