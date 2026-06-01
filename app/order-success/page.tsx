'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

function OrderSuccessContent() {
  const params = useSearchParams()
  const ref = params.get('ref')

  return (
    <main className="min-h-screen pt-14 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-8">
          <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
            <path d="M2 11l8 9L26 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="font-serif text-4xl mb-3">Order Confirmed</h1>
        <p className="font-inter text-sm text-gray-500 mb-2">ขอบคุณสำหรับการสั่งซื้อ</p>
        {ref && (
          <p className="font-inter text-xs text-gray-400 mb-10">Reference: {ref}</p>
        )}

        <div className="flex gap-4">
          <Link
            href="/"
            className="font-inter text-sm border border-black rounded-full px-6 py-2.5 hover:bg-gray-50 transition-colors"
          >
            กลับหน้าหลัก
          </Link>
          <Link
            href="/shop"
            className="font-inter text-sm bg-black text-white rounded-full px-6 py-2.5 hover:bg-gray-800 transition-colors"
          >
            ช้อปต่อ
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  )
}
