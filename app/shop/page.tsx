import { client } from '@/sanity/lib/client'
import { ALL_PRODUCTS_QUERY } from '@/sanity/lib/queries'
import ShopClient from './ShopClient'

export const revalidate = 60

export default async function ShopPage() {
  const products = await client.fetch(ALL_PRODUCTS_QUERY, { category: '' })

  return <ShopClient products={products} />
}
