import type { Metadata } from 'next'
import { EB_Garamond, Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'
import SessionWrapper from '@/components/SessionWrapper'

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  weight: ['400', '500'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'worldbranded',
  description: 'Fashion e-commerce',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={`${ebGaramond.variable} ${inter.variable} font-serif antialiased bg-white text-black`}>
        <SessionWrapper>
          <CartProvider>
            <CartDrawer />
            {children}
          </CartProvider>
        </SessionWrapper>
      </body>
    </html>
  )
}
