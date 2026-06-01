'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    closeCart()
    router.push('/checkout')
  }

  // lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 w-full max-w-sm bg-white flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-serif text-xl tracking-tight">Shopping Bag</h2>
          <button onClick={closeCart} className="text-black hover:opacity-50 transition-opacity">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="font-inter text-sm text-gray-400">Your bag is empty.</p>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  {/* Product image */}
                  <div className="relative w-24 h-28 flex-shrink-0 bg-[#D8D8D8] overflow-hidden">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-inter text-sm leading-snug">{item.name}</p>
                        <p className="font-inter text-sm text-gray-400 mt-0.5">{item.description}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-black transition-colors flex-shrink-0 mt-0.5"
                      >
                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                          <path d="M1 3.5H13M5 3.5V2.5C5 1.948 5.448 1.5 6 1.5H8C8.552 1.5 9 1.948 9 2.5V3.5M2 3.5L2.5 13C2.5 13.828 3.172 14.5 4 14.5H10C10.828 14.5 11.5 13.828 11.5 13L12 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>

                    {/* Qty + price */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 border-b border-gray-300 pb-0.5">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="font-inter text-lg leading-none hover:opacity-50 transition-opacity"
                        >−</button>
                        <span className="font-inter text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="font-inter text-lg leading-none hover:opacity-50 transition-opacity"
                        >+</button>
                      </div>
                      <p className="font-inter text-sm">฿{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-5 space-y-4">
          <div className="flex justify-between items-baseline">
            <div>
              <p className="font-inter text-sm">Subtotal</p>
              <p className="font-inter text-xs text-gray-400">VAT included</p>
            </div>
            <p className="font-inter text-sm">฿{subtotal.toLocaleString()}</p>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-black text-white font-inter text-sm py-3 rounded-full hover:bg-gray-800 transition-colors tracking-wide"
          >
            Secure Checkout
          </button>
          <button className="w-full border border-black font-inter text-sm py-3 rounded-full hover:bg-gray-50 transition-colors tracking-wide">
            View Bag Details
          </button>
        </div>
      </div>
    </>
  )
}
