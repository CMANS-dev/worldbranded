import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { defineQuery } from 'next-sanity'

const ADMIN_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    price,
    category,
    inStock,
    tags,
    "brand": brand->name,
    "images": images[]{
      "url": asset->url,
      alt
    }
  }
`)

export async function GET() {
  const products = await client.fetch(ADMIN_PRODUCTS_QUERY)
  return NextResponse.json(products)
}
