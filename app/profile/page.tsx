'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

const sections = [
  { label: 'Profile Details', href: '/profile/details', desc: 'Update your name and email' },
  { label: 'Order History', href: '/profile/orders', desc: 'View your past orders' },
  { label: 'Address Book', href: '/profile/address', desc: 'Manage your addresses' },
  { label: 'Wishlist', href: '/profile/wishlist', desc: 'Items you saved' },
]

export default function ProfileDashboard() {
  const { data: session } = useSession()

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Account Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}
            className="border border-gray-100 p-6 hover:border-black transition-colors rounded-sm">
            <p className="font-inter text-sm font-medium mb-1">{s.label}</p>
            <p className="font-inter text-xs text-gray-400">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
