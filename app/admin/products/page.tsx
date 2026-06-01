'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  category?: string
  inStock: boolean
  brand?: string
  images?: { url: string; alt?: string }[]
  tags?: string[]
}

const TAG_LABEL: Record<string, string> = {
  'new-arrival': 'New',
  'on-sale': 'Sale',
  'featured': 'Featured',
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false) })
  }, [])

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggleStock = async (id: string, inStock: boolean) => {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock: !inStock }),
    })
    setProducts(prev => prev.map(p => p._id === id ? { ...p, inStock: !inStock } : p))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-black text-white text-xs px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          + เพิ่มสินค้า
        </Link>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="ค้นหาสินค้า..."
        className="border border-gray-200 rounded-full px-4 py-2 text-sm font-inter w-64 outline-none focus:border-black mb-4 transition-colors"
      />

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400">กำลังโหลด...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['', 'ชื่อสินค้า', 'หมวดหมู่', 'ราคา', 'Tags', 'สต็อก', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-xs text-gray-400">ไม่มีสินค้า</td></tr>
              ) : filtered.map((p) => (
                <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 w-12">
                    {p.images?.[0]?.url ? (
                      <div className="relative w-10 h-10 bg-gray-100">
                        <Image src={p.images[0].url} alt={p.name} fill className="object-cover" sizes="40px" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-100" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium">{p.name}</p>
                    {p.brand && <p className="text-xs text-gray-400">{p.brand}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 capitalize">{p.category ?? '-'}</td>
                  <td className="px-4 py-3 text-xs">฿{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {p.tags?.map(t => (
                        <span key={t} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {TAG_LABEL[t] ?? t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStock(p._id, p.inStock)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        p.inStock ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-500 border-red-200'
                      }`}
                    >
                      {p.inStock ? 'In Stock' : 'Out'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${p._id}`} className="text-xs text-gray-400 hover:text-black underline underline-offset-2">
                      แก้ไข
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
