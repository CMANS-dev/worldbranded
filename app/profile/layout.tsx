'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const navItems = [
  { label: 'Account Dashboard', href: '/profile' },
  { label: 'Profile Details', href: '/profile/details' },
  { label: 'Change Password', href: '/profile/password' },
  { label: 'Order History', href: '/profile/orders' },
  { label: 'Address Book', href: '/profile/address' },
  { label: 'Wishlist', href: '/profile/wishlist' },
]

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const firstName = session?.user?.name?.split(' ')[0]?.toUpperCase() ?? 'GUEST'

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-14 max-w-5xl mx-auto px-6 py-12 grid grid-cols-[220px_1fr] gap-16 items-start">

        {/* Sidebar */}
        <aside>
          <div className="mb-6">
            <p className="font-serif text-lg">HELLO, {firstName}</p>
            <button
              onClick={handleSignOut}
              className="font-inter text-xs text-gray-400 underline underline-offset-2 hover:text-black transition-colors mt-0.5"
            >
              Sign Out
            </button>
          </div>

          <nav className="space-y-0.5 mb-8">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block font-inter text-sm py-2 px-3 transition-colors ${
                    active
                      ? 'border-l-2 border-black pl-2.5 font-medium'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-gray-100 pt-6">
            <p className="font-inter text-xs font-medium text-gray-500 mb-3">NEED ASSISTANCE?</p>
            <div className="space-y-2 font-inter text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1.5h2l1 3-1.5 1a8 8 0 0 0 4 4l1-1.5 3 1V11a1 1 0 0 1-1 1C4 12 0 8 0 2.5A1 1 0 0 1 1 1.5Z" stroke="currentColor" strokeWidth="1"/></svg>
                <span>+66 2 123 4567</span>
              </div>
              <p className="text-gray-400">Monday to Friday, 10:00 — 20:00</p>
              <a href="mailto:hello@worldbranded.com" className="underline underline-offset-2 hover:text-black transition-colors block">
                Fill the contact form to reach us
              </a>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  )
}
