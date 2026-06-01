import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { PRODUCT_BY_SLUG_QUERY, ALL_PRODUCTS_QUERY } from '@/sanity/lib/queries'
import ProductClient from './ProductClient'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const [product, allProducts] = await Promise.all([
    client.fetch(PRODUCT_BY_SLUG_QUERY, { slug: params.id }),
    client.fetch(ALL_PRODUCTS_QUERY, { category: '' }),
  ])

  if (!product) notFound()

  // related = สินค้า category เดียวกัน ยกเว้นตัวเอง max 4
  const related = allProducts
    .filter((p: any) => p._id !== product._id && p.categories?.[0] === product.categories?.[0])
    .slice(0, 4)

  // ถ้าไม่ครบ 4 ให้เติมจาก category อื่น
  const fill = allProducts
    .filter((p: any) => p._id !== product._id && p.categories?.[0] !== product.categories?.[0])
    .slice(0, 4 - related.length)

  return <ProductClient product={product} related={[...related, ...fill]} />
}
