import { NextResponse } from 'next/server'
import { apiVersion, dataset, projectId } from '@/sanity/env'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop() ?? 'jpg'

    // อัปโหลดไปยัง Sanity Assets API
    const res = await fetch(
      `https://api.sanity.io/v${apiVersion}/assets/images/${dataset}?filename=${file.name}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': file.type || `image/${ext}`,
          Authorization: `Bearer ${process.env.SANITY_API_WRITE_TOKEN}`,
        },
        body: buffer,
      }
    )

    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data }, { status: res.status })

    // ส่งกลับ asset id + url
    return NextResponse.json({
      assetId: data.document._id,
      url: data.document.url,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
