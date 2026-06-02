import { client } from '@/sanity/lib/client'
import { ALL_PRODUCTS_QUERY } from '@/sanity/lib/queries'
import ShopClient from './ShopClient'

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const products = await client.fetch(
    ALL_PRODUCTS_QUERY,
    { category: '' },
    { next: { tags: ['products'] } },
  )

  return <ShopClient products={products} />
}
