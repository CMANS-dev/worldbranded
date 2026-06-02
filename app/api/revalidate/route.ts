import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { isValidSignature } from '@/sanity/lib/webhook'

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET

  if (!secret) {
    return NextResponse.json({ message: 'SANITY_WEBHOOK_SECRET not set' }, { status: 500 })
  }

  // อ่าน body เป็น text เพื่อ verify signature (ต้องใช้ raw body)
  const body = await req.text()
  const signature = req.headers.get('sanity-webhook-signature')

  const valid = await isValidSignature(body, signature, secret)
  if (!valid) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
  }

  let payload: { _type?: string } = {}
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 })
  }

  // revalidate tag ตาม document type
  const type = payload._type

  if (!type || type === 'product') {
    revalidateTag('products')
  }

  return NextResponse.json({ revalidated: true, type: type ?? 'unknown' })
}
