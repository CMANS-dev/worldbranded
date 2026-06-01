import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'
import { defineQuery } from 'next-sanity'

const writeClient = createClient({
  projectId, dataset, apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

const BRANDS_QUERY = defineQuery(`
  *[_type == "brand"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    "logo": logo.asset->url,
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`)

export async function GET() {
  try {
    const brands = await client.fetch(BRANDS_QUERY)
    return NextResponse.json(brands)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name, description, logoAssetId } = await req.json()
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

    const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')

    const doc = await writeClient.create({
      _type: 'brand',
      name,
      slug: { _type: 'slug', current: slug },
      description,
      ...(logoAssetId ? { logo: { _type: 'image', asset: { _type: 'reference', _ref: logoAssetId } } } : {}),
    })

    return NextResponse.json({ success: true, id: doc._id }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
