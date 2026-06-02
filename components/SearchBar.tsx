'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="flex flex-col gap-3 items-start">
      <h3 className="text-3xl">Search</h3>

      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleSearch}
        placeholder="Search Here"
        className="font-inter border border-gray-400 rounded-full px-4 py-1 text-sm w-60 outline-none focus:border-gray-700 transition-colors"
      />

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => router.push('/shop?filter=brand')}
          className="font-inter border border-gray-400 rounded-full px-3 py-1 text-xs hover:bg-gray-100 transition-colors">
          Shop by brand
        </button>
        <button
          onClick={() => router.push('/shop?filter=category')}
          className="font-inter border border-gray-400 rounded-full px-3 py-1 text-xs hover:bg-gray-100 transition-colors">
          Shop by category
        </button>
        <button
          onClick={() => router.push('/shop')}
          className="font-inter border border-gray-800 rounded-full px-3 py-1 text-xs bg-white hover:bg-gray-50 transition-colors">
          See All
        </button>
      </div>
    </div>
  )
}
