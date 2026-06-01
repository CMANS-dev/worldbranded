'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import { SanityProduct } from '@/components/ProductSection'

const categories = ['Women', 'Men', 'Bags', 'Accessories']

function SortIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <line x1="9" y1="18" x2="15" y2="18" />
    </svg>
  )
}

export default function ShopClient({ products }: { products: SanityProduct[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = !activeCategory || p.categories?.includes(activeCategory.toLowerCase())
      const matchQ = !query || p.name.toLowerCase().includes(query.toLowerCase())
      return matchCat && matchQ
    })
  }, [products, activeCategory, query])

  return (
    <main className="min-h-screen pt-14">
      <Navbar />

      {/* Breadcrumb */}
      <div className="px-4 md:px-6 pt-4 pb-1 text-sm text-gray-400">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-black">All Products</span>
      </div>

      {/* Header — mobile: stacked, desktop: side by side */}
      <div className="px-4 md:px-0 pt-4 pb-6 md:grid md:grid-cols-4">
        <div className="md:col-span-3 md:px-6 mb-4 md:mb-0">
          <h1 className="text-3xl md:text-4xl">All Products</h1>
        </div>
        <div className="flex flex-col gap-3 md:pr-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search here"
            className="border border-gray-400 rounded-full px-4 py-1.5 text-sm w-full outline-none focus:border-gray-700 transition-colors placeholder:text-gray-400"
          />
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`border rounded-full px-3 py-1 text-sm transition-colors ${
                  activeCategory === cat ? 'bg-black text-white border-black' : 'border-black hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
            <button className="border border-black rounded-full px-3 py-1 text-sm flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
              Filter <SortIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Grid — 2 cols mobile, 4 cols desktop */}
      {filtered.length > 0 ? (
        <div className="px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-[10px]">
          {filtered.map((p) => (
            <ProductCard
              key={p._id}
              slug={p.slug}
              price={p.price}
              name={p.name}
              images={p.images}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center font-inter text-gray-400 text-sm">
          No products found.
        </div>
      )}

      <Footer />
    </main>
  )
}
