'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { label: 'Overview', href: '/admin', icon: '◈' },
  { label: 'Products', href: '/admin/products', icon: '▦' },
  { label: 'Brands', href: '/admin/brands', icon: '◇' },
  { label: 'Orders', href: '/admin/orders', icon: '▤' },
  { label: 'Customers', href: '/admin/customers', icon: '◉' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex bg-gray-50 font-inter">

      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col fixed top-0 bottom-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <Link href="/" className="font-serif text-lg block">worldbranded®</Link>
          <p className="text-xs text-gray-400 mt-0.5 font-inter">Admin</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map((item) => {
            const active = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors ${
                  active ? 'bg-black text-white' : 'text-gray-500 hover:text-black hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-0.5">
          <Link
            href="/studio"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-sm text-sm text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
          >
            <span>⬡</span> Sanity Studio
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-sm text-sm text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
          >
            <span>←</span> View Site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-56 min-h-screen">
        {children}
      </main>
    </div>
  )
}
