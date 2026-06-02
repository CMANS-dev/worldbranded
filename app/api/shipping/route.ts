import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { SHIPPING_QUERY } from '@/sanity/lib/queries'

export async function GET() {
  try {
    const methods = await client.fetch(SHIPPING_QUERY)
    return NextResponse.json(methods)
  } catch (error) {
    return NextResponse.json([], { status: 200 })
  }
}
