import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

const writeClient = createClient({
  projectId, dataset, apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const doc = await writeClient.create({
      _type: 'product',
      name: body.name,
      slug: { _type: 'slug', current: body.slug },
      price: body.price,
      category: body.category,
      description: body.description,
      inStock: body.inStock ?? true,
      tags: body.tags ?? [],
      images: (body.images ?? []).map((img: any, i: number) => ({
        ...img,
        _key: `img-${i}-${Date.now()}`,
      })),
    })

    return NextResponse.json({ success: true, id: doc._id }, { status: 201 })
  } catch (error: any) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
