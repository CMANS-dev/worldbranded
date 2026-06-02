import Navbar from '@/components/Navbar'
import ProductSection from '@/components/ProductSection'
import PromoBanner from '@/components/PromoBanner'
import Footer from '@/components/Footer'
import { client } from '@/sanity/lib/client'
import { NEW_ARRIVALS_QUERY, ON_SALE_QUERY } from '@/sanity/lib/queries'

export const dynamic = 'force-dynamic' // ไม่ cache — fetch ใหม่ทุก request

export default async function Home() {
  const [newArrivals, onSale] = await Promise.all([
    client.fetch(NEW_ARRIVALS_QUERY, {}, { next: { tags: ['products'] } }),
    client.fetch(ON_SALE_QUERY, {}, { next: { tags: ['products'] } }),
  ])

  return (
    <main className="min-h-screen pt-14">
      <Navbar />

      {/* ── New Arrivals ── */}
      <ProductSection title="New Arrivals" products={newArrivals} showSearch />

      {/* ── Promotions full ── */}
      <section className="py-12">
        <h2 className="px-6 text-4xl mb-4">Promotions</h2>
        <PromoBanner variant="full" />
      </section>

      {/* ── Promotions half ── */}
      <section className="py-12">
        <h2 className="px-6 text-4xl mb-4">Promotions</h2>
        <PromoBanner variant="half" />
      </section>

      {/* ── On Sale ── */}
      {onSale.length > 0 && (
        <ProductSection title="On Sale" products={onSale} />
      )}

      <Footer />
    </main>
  )
}
