'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { SanityProduct } from '@/components/ProductSection'

interface Props {
  product: SanityProduct & { brand?: string }
  related: SanityProduct[]
}

const infoRows = ['Product details', 'Size']

export default function ProductClient({ product, related }: Props) {
  const { addItem } = useCart()
  const [openRow, setOpenRow] = useState<string | null>(null)
  const images = product.images ?? []

  return (
    <main className="min-h-screen pt-14">
      <Navbar />

      {/* ── Layout: stacked on mobile, two-col on desktop ── */}
      <div className="flex flex-col md:flex-row md:items-start">

        {/* Images — full width mobile, half desktop */}
        <div className="w-full md:w-1/2 md:flex-shrink-0">
          {images.length > 0 ? (
            images.map((img, i) => (
              <div key={i} className="relative w-full aspect-square bg-[#D8D8D8]">
                <Image
                  src={img.url}
                  alt={img.alt ?? product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={i === 0}
                />
              </div>
            ))
          ) : (
            <>
              <div className="bg-[#D8D8D8] w-full aspect-square" />
              <div className="bg-[#D8D8D8] w-full aspect-square" />
            </>
          )}
        </div>

        {/* Info panel — full width mobile, sticky half desktop */}
        <div className="w-full md:w-1/2 px-4 md:px-10 pt-6 md:pt-8 pb-10 md:sticky md:top-14 md:self-start md:max-h-[calc(100vh-3.5rem)] md:overflow-y-auto">

          {/* Breadcrumb */}
          <p className="font-inter text-xs text-gray-400 mb-4 md:mb-6">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            {' / '}
            <Link href="/shop" className="hover:text-black transition-colors">All Products</Link>
            {' / '}
            <span className="text-black capitalize">{product.categories?.[0] ?? ''}</span>
          </p>

          {product.brand && (
            <p className="font-inter text-sm text-gray-400 mb-1">{product.brand}</p>
          )}
          <p className="font-inter text-sm text-gray-400 mb-2 capitalize">{product.categories?.join(', ') ?? ''}</p>
          <h1 className="text-2xl md:text-3xl leading-snug mb-2">{product.name}</h1>
          <p className="font-inter text-base mb-6 md:mb-8">฿ {product.price.toLocaleString()}</p>

          {/* CTA */}
          <div className="flex gap-3 mb-8 md:mb-10">
            <button className="font-inter border border-black rounded-full px-5 md:px-6 py-2 text-sm hover:bg-gray-50 transition-colors">
              Wishlist
            </button>
            <button
              onClick={() => addItem({
                id: product._id,
                name: product.name,
                price: product.price,
                description: product.description ?? '',
                image: images[0]?.url,
              })}
              className="font-inter bg-black text-white rounded-full px-5 md:px-6 py-2 text-sm hover:bg-gray-800 transition-colors"
            >
              Add to Bag
            </button>
          </div>

          {/* Accordion */}
          {infoRows.map((label) => (
            <div key={label} className="border-t border-black">
              <button
                onClick={() => setOpenRow(openRow === label ? null : label)}
                className="w-full flex items-center justify-between py-3 hover:opacity-60 transition-opacity"
              >
                <span className="font-inter text-sm">{label}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                  className={`transition-transform duration-200 ${openRow === label ? 'rotate-180' : ''}`}>
                  <path d="M1 4l5 5 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
              {openRow === label && (
                <div className="pb-4 font-inter text-sm text-gray-500 leading-relaxed">
                  {label === 'Product details' && (product.description ?? 'No details available.')}
                  {label === 'Size' && 'Please refer to our size guide.'}
                </div>
              )}
            </div>
          ))}
          <div className="border-t border-black" />
        </div>
      </div>

      {/* You May Also Like */}
      {related.length > 0 && (
        <section className="py-10 md:py-12">
          <h2 className="px-4 md:px-6 text-3xl md:text-4xl mb-4">You May Also Like</h2>
          <div className="px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-[10px]">
            {related.map((p) => (
              <ProductCard key={p._id} slug={p.slug} price={p.price} name={p.name} images={p.images} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
