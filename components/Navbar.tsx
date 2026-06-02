'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { openCart, totalCount } = useCart()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/50 border-b border-white/20 transition-all duration-300">
        <div className="relative flex items-center justify-between px-4 md:px-6 py-4">

          {/* Logo */}
          <a href="/" className="font-serif tracking-tight text-lg">
            worldbranded®
          </a>

          {/* Search — desktop only, appears on scroll */}
          <div className={`hidden md:block absolute left-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out ${scrolled ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'}`}>
            <input
              type="text"
              placeholder="Search Here"
              className="border border-gray-400 rounded-full px-4 py-1.5 text-lg w-56 bg-white/60 backdrop-blur-sm outline-none focus:border-gray-700 transition-colors placeholder:text-gray-400 font-inter"
            />
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex gap-6 text-lg items-baseline">
            {[{ label: 'Shop', href: '/shop' }, { label: 'Profile', href: '/profile' }].map(({ label, href }) => {
              const active = pathname.startsWith(href)
              return (
                <a key={href} href={href}
                  className={`relative hover:opacity-50 transition-opacity pb-0.5 ${active ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-black' : ''}`}>
                  {label}
                </a>
              )
            })}
            <button onClick={openCart} className="hover:opacity-50 transition-opacity relative">
              Bag{totalCount > 0 && <sup className="font-inter text-xs ml-0.5">{totalCount}</sup>}
            </button>
          </div>

          {/* Mobile right side: bag + hamburger */}
          <div className="flex md:hidden items-center gap-4">
            <button onClick={openCart} className="relative text-base">
              Bag{totalCount > 0 && <sup className="font-inter text-xs ml-0.5">{totalCount}</sup>}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col gap-1.5 p-1" aria-label="Menu">
              <span className={`block w-5 h-px bg-black transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-5 h-px bg-black transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-px bg-black transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`fixed inset-0 z-30 bg-white flex flex-col pt-20 px-6 transition-all duration-300 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Search */}
        <input
          type="text"
          placeholder="Search Here"
          className="border border-gray-300 rounded-full px-4 py-2.5 text-base font-inter outline-none focus:border-black transition-colors placeholder:text-gray-400 mb-10 w-full"
        />
        <nav className="flex flex-col gap-8">
          {[
            { label: 'Shop', href: '/shop' },
            { label: 'Profile', href: '/account' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="font-serif text-4xl tracking-tight hover:opacity-50 transition-opacity"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </>
  )
}
