import { NextResponse } from 'next/server'

/*
  inquiry-deposit response (doc p.14):
  resp_code 200 = found
  data.aml_status = "Approved" | "Pending" | "Rejected"
  data.payment_status = actual payment status
  data.status = "201" = Created (not yet paid)

  Paid = resp_code 200 AND aml_status = "Approved"
*/

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const trans_id = searchParams.get('trans_id')

    if (!trans_id) {
      return NextResponse.json({ error: 'Missing trans_id' }, { status: 400 })
    }

    const res = await fetch(
      `https://${process.env.INQUIRY_URL}/inquiry-deposit/${trans_id}`,
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Partnercode': process.env.PAYMENT_PARTNER_CODE!,
          'authorization': process.env.PAYMENT_AUTHORIZATION!,
        },
      }
    )

    const data = await res.json()
    console.log('🔍 Inquiry response:', JSON.stringify(data, null, 2))

    // เพิ่ม field paid เพื่อให้ frontend เช็คง่าย
    const paid = data.resp_code === 200 &&
      (data.data?.aml_status === 'Approved' || data.data?.payment_status === 'SUCCESS')

    return NextResponse.json({ ...data, paid })
  } catch (error) {
    console.error('Payment inquiry error:', error)
    return NextResponse.json({ error: 'Failed to inquiry' }, { status: 500 })
  }
}
