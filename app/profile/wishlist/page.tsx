'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'

export default function WishlistPage() {
  const { items, removeItem } = useWishlist()
  const { addItem } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return <div className="py-8 font-inter text-sm text-gray-400">กำลังโหลด...</div>

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Wishlist</h1>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-inter text-sm text-gray-400 mb-4">Your wishlist is empty.</p>
          <Link href="/shop" className="font-inter text-sm underline underline-offset-2 hover:opacity-60">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
              <Link href={`/products/${item.slug}`} className="relative w-20 h-24 bg-[#D8D8D8] flex-shrink-0">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                )}
              </Link>
              <div className="flex-1">
                <Link href={`/products/${item.slug}`} className="font-inter text-sm hover:opacity-60 transition-opacity">
                  {item.name}
                </Link>
                <p className="font-inter text-sm text-gray-500 mt-0.5">฿{item.price.toLocaleString()}</p>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => addItem({ id: item.id, name: item.name, price: item.price, description: '' , image: item.image })}
                    className="font-inter text-xs bg-black text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Add to Bag
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="font-inter text-xs text-gray-400 hover:text-black transition-colors underline underline-offset-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
