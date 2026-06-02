'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface WishlistItem {
  id: string
  name: string
  price: number
  slug: string
  image?: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  isWishlisted: (id: string) => boolean
  toggleItem: (item: WishlistItem) => void
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [mounted, setMounted] = useState(false)

  // load from localStorage after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wishlist')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
    setMounted(true)
  }, [])

  // save to localStorage
  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem('wishlist', JSON.stringify(items))
    } catch {}
  }, [items, mounted])

  const addItem = (item: WishlistItem) => {
    setItems(prev => prev.find(i => i.id === item.id) ? prev : [...prev, item])
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const isWishlisted = (id: string) => items.some(i => i.id === id)

  const toggleItem = (item: WishlistItem) => {
    isWishlisted(item.id) ? removeItem(item.id) : addItem(item)
  }

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isWishlisted, toggleItem }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
