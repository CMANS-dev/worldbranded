import Navbar from '@/components/Navbar'
import ProductSection from '@/components/ProductSection'
import PromoBanner, { type PromoBannerData } from '@/components/PromoBanner'
import Footer from '@/components/Footer'
import { client } from '@/sanity/lib/client'
import { NEW_ARRIVALS_QUERY, ON_SALE_QUERY, PROMO_BANNERS_QUERY } from '@/sanity/lib/queries'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [newArrivals, onSale, banners] = await Promise.all([
    client.fetch(NEW_ARRIVALS_QUERY, {}, { cache: 'no-store' }),
    client.fetch(ON_SALE_QUERY, {}, { cache: 'no-store' }),
    client.fetch(PROMO_BANNERS_QUERY, {}, { cache: 'no-store' }),
  ])

  const fullBanner: PromoBannerData = banners.find((b: PromoBannerData) => b.layout === 'full')
    ?? { _id: 'full-placeholder', layout: 'full' }

  const halfBanner: PromoBannerData = banners.find((b: PromoBannerData) => b.layout === 'half')
    ?? { _id: 'half-placeholder', layout: 'half' }

  // You May Also Like — สินค้าที่ไม่ซ้ำกับ New Arrivals, สุ่มจาก on-sale ก่อน แล้วเติมจาก new arrivals
  const alsoLike = [
    ...onSale.filter((p: any) => !newArrivals.find((n: any) => n._id === p._id)),
    ...newArrivals,
  ].slice(0, 4)

  return (
    <main className="min-h-screen pt-14">
      <Navbar />

      {/* ── New Arrivals ── */}
      <ProductSection title="New Arrivals" products={newArrivals} showSearch />

      {/* ── Promotions full ── */}
      <section className="py-12">
        <h2 className="px-6 text-4xl mb-4">Promotions</h2>
        <PromoBanner banner={fullBanner} />
      </section>

      {/* ── Shop by Him / Her ── */}
      <section className="py-12">
        <h2 className="px-6 text-4xl mb-4">Shop by</h2>
        <PromoBanner banner={halfBanner} />
      </section>

      {/* ── You May Also Like ── */}
      {alsoLike.length > 0 && (
        <ProductSection title="You May Also Like" products={alsoLike} />
      )}

      <Footer />
    </main>
  )
}
