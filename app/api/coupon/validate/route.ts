import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

// ใช้ client แบบมี token เพื่อ write (increment usedCount)
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

export async function POST(req: Request) {
  try {
    const { code, subtotal, deliveryFee } = await req.json()

    if (!code) {
      return NextResponse.json({ error: 'กรุณาใส่โค้ดส่วนลด' }, { status: 400 })
    }

    const coupon = await readClient.fetch(
      `*[_type == "coupon" && code == $code && isActive == true][0]{
        _id, code, type, value, minOrderAmount, usageLimit, usedCount, expiresAt
      }`,
      { code: code.toUpperCase().trim() },
      { cache: 'no-store' },
    )

    if (!coupon) {
      return NextResponse.json({ error: 'โค้ดนี้ไม่ถูกต้องหรือไม่มีในระบบ' }, { status: 404 })
    }

    // เช็ควันหมดอายุ
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'โค้ดนี้หมดอายุแล้ว' }, { status: 400 })
    }

    // เช็คจำนวนครั้ง
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'โค้ดนี้ถูกใช้ครบจำนวนแล้ว' }, { status: 400 })
    }

    // เช็คยอดขั้นต่ำ
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return NextResponse.json({
        error: `ต้องมียอดสั่งซื้อขั้นต่ำ ฿${coupon.minOrderAmount.toLocaleString()}`,
      }, { status: 400 })
    }

    // คำนวณส่วนลด
    let discountAmount = 0
    let discountLabel = ''

    if (coupon.type === 'percent') {
      discountAmount = Math.round(subtotal * (coupon.value / 100))
      discountLabel = `${coupon.value}% ส่วนลด`
    } else if (coupon.type === 'free_shipping') {
      discountAmount = deliveryFee ?? 0
      discountLabel = 'ฟรีค่าส่ง'
    }

    return NextResponse.json({
      valid: true,
      couponId: coupon._id,
      code: coupon.code,
      type: coupon.type,
      discountAmount,
      discountLabel,
    })
  } catch (error: any) {
    console.error('Coupon validate error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' }, { status: 500 })
  }
}
