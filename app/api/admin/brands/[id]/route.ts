import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

const writeClient = createClient({
  projectId, dataset, apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, description, logoAssetId } = await req.json()
    const patch: any = {}
    if (name !== undefined) patch.name = name
    if (description !== undefined) patch.description = description
    if (logoAssetId) patch.logo = { _type: 'image', asset: { _type: 'reference', _ref: logoAssetId } }

    const result = await writeClient.patch(params.id).set(patch).commit()
    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await writeClient.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
