'use client'

export default function SearchBar() {
  return (
    <div className="flex flex-col gap-3 items-start">
      <h3 className="text-3xl">Search</h3>

      <input
        type="text"
        placeholder="Search Here"
        className="font-inter border border-gray-400 rounded-full px-4 py-1 text-sm w-60 outline-none focus:border-gray-700 transition-colors"
      />

      <div className="flex gap-2 flex-wrap">
        <button className="font-inter border border-gray-400 rounded-full px-3 py-1 text-xs hover:bg-gray-100 transition-colors">
          Shop by brand
        </button>
        <button className="font-inter border border-gray-400 rounded-full px-3 py-1 text-xs hover:bg-gray-100 transition-colors">
          Shop by category
        </button>
        <button className="font-inter border border-gray-800 rounded-full px-3 py-1 text-xs bg-white hover:bg-gray-50 transition-colors">
          See All
        </button>
      </div>
    </div>
  )
}
