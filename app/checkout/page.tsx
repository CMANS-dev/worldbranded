'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { useCart } from '@/context/CartContext'
import QRPaymentModal from '@/components/QRPaymentModal'

const DELIVERY_FEE = 150

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0)

  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [showQR, setShowQR] = useState(false)
  const [orderId] = useState(() => `ORD-${Date.now()}`)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', company: '',
    address1: '', address2: '', city: '', region: '', postal: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const required = ['firstName', 'lastName', 'phone', 'address1', 'city', 'postal']
  const labels: Record<string, string> = {
    firstName: 'First Name', lastName: 'Last Name', phone: 'Phone Number',
    company: 'Company Name', address1: 'Address Line 1', address2: 'Address Line 2',
    city: 'City', region: 'Region', postal: 'Postal Code',
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    required.forEach((k) => { if (!form[k as keyof typeof form].trim()) errs[k] = 'This field is required.' })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleContinue = () => {
    if (validate()) setStep(2)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <Navbar />

      {/* ── Top bar ── */}
      <header className="mt-14 border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-inter text-gray-500">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1a4 4 0 0 1 4 4c0 3-4 8-4 8S3 8 3 5a4 4 0 0 1 4-4Z" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="7" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          Secure Checkout
        </div>
        <div className="flex items-center gap-2 text-sm font-inter text-gray-500">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2h2.5l1 3-1.5 1a9 9 0 0 0 4 4l1-1.5 3 1V12a1 1 0 0 1-1 1C5 13 1 9 1 3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          +66 2 123 4567
        </div>
      </header>

      {/* ── Back button ── */}
      <div className="max-w-5xl mx-auto w-full px-6 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 font-inter text-sm text-gray-500 hover:text-black transition-colors group"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:-translate-x-0.5">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-6 py-8 grid grid-cols-1 md:grid-cols-[1fr_360px] gap-10 md:gap-16 items-start">

        {/* LEFT — Form */}
        <div className="space-y-10">

          {/* Step 1: Shipping */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-inter font-medium border ${step >= 1 ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-400'}`}>1</span>
              <h2 className="font-inter text-sm tracking-widest uppercase text-gray-500">Shipping</h2>
            </div>

            {step === 1 && (
              <div className="space-y-5">
                {/* First Name */}
                <div>
                  <label className={`block font-inter text-sm mb-1 ${errors.firstName ? 'text-red-500' : 'text-gray-600'}`}>
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className={`w-full border-b font-inter text-sm py-2 outline-none bg-transparent transition-colors ${errors.firstName ? 'border-red-400' : 'border-gray-300 focus:border-black'}`}
                  />
                  {errors.firstName && <p className="font-inter text-xs text-red-500 mt-1">{errors.firstName}</p>}
                </div>

                {/* Last Name */}
                <div>
                  <label className={`block font-inter text-sm mb-1 ${errors.lastName ? 'text-red-500' : 'text-gray-600'}`}>
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className={`w-full border-b font-inter text-sm py-2 outline-none bg-transparent transition-colors ${errors.lastName ? 'border-red-400' : 'border-gray-300 focus:border-black'}`}
                  />
                  {errors.lastName && <p className="font-inter text-xs text-red-500 mt-1">{errors.lastName}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className={`block font-inter text-sm mb-1 ${errors.phone ? 'text-red-500' : 'text-gray-600'}`}>
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-3 border-b border-gray-300">
                    <span className="font-inter text-sm py-2 text-gray-500 flex items-center gap-1">🇹🇭 +66</span>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="081 234 5678"
                      className="flex-1 font-inter text-sm py-2 outline-none bg-transparent placeholder:text-gray-300"
                    />
                  </div>
                  {errors.phone && <p className="font-inter text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                {/* Company */}
                <div>
                  <label className="block font-inter text-sm mb-1 text-gray-600">
                    Company Name <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <input
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full border-b border-gray-300 font-inter text-sm py-2 outline-none bg-transparent focus:border-black transition-colors"
                  />
                </div>

                

                {/* Address 1 */}
                <div>
                  <label className={`block font-inter text-sm mb-1 ${errors.address1 ? 'text-red-500' : 'text-gray-600'}`}>
                    Address Line 1 <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.address1}
                    onChange={(e) => setForm({ ...form, address1: e.target.value })}
                    className={`w-full border-b font-inter text-sm py-2 outline-none bg-transparent transition-colors ${errors.address1 ? 'border-red-400' : 'border-gray-300 focus:border-black'}`}
                  />
                  {errors.address1 && <p className="font-inter text-xs text-red-500 mt-1">{errors.address1}</p>}
                </div>

                {/* Address 2 */}
                <div>
                  <label className="block font-inter text-sm mb-1 text-gray-600">
                    Address Line 2 <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <input
                    value={form.address2}
                    onChange={(e) => setForm({ ...form, address2: e.target.value })}
                    className="w-full border-b border-gray-300 font-inter text-sm py-2 outline-none bg-transparent focus:border-black transition-colors"
                  />
                </div>

                {/* City + Region */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={`block font-inter text-sm mb-1 ${errors.city ? 'text-red-500' : 'text-gray-600'}`}>
                      City <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className={`w-full border-b font-inter text-sm py-2 outline-none bg-transparent transition-colors ${errors.city ? 'border-red-400' : 'border-gray-300 focus:border-black'}`}
                    />
                    {errors.city && <p className="font-inter text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block font-inter text-sm mb-1 text-gray-600">
                      Region <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <input
                      value={form.region}
                      onChange={(e) => setForm({ ...form, region: e.target.value })}
                      className="w-full border-b border-gray-300 font-inter text-sm py-2 outline-none bg-transparent focus:border-black transition-colors"
                    />
                  </div>
                </div>

                {/* Postal */}
                <div>
                  <label className={`block font-inter text-sm mb-1 ${errors.postal ? 'text-red-500' : 'text-gray-600'}`}>
                    Postal Code <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.postal}
                    onChange={(e) => setForm({ ...form, postal: e.target.value })}
                    placeholder="Example: 10110"
                    className={`w-full border-b font-inter text-sm py-2 outline-none bg-transparent placeholder:text-gray-300 transition-colors ${errors.postal ? 'border-red-400' : 'border-gray-300 focus:border-black'}`}
                  />
                  {errors.postal && <p className="font-inter text-xs text-red-500 mt-1">{errors.postal}</p>}
                </div>

                {/* Shipping method */}
                <div className="pt-4">
                  <p className="font-inter text-sm text-gray-600 mb-3">Select Shipping Method</p>
                  <label className="flex items-center justify-between border border-black rounded-sm px-4 py-3 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full border-2 border-black flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-black" />
                      </span>
                      <div>
                        <p className="font-inter text-sm">Same day delivery</p>
                        <p className="font-inter text-xs text-gray-400">Rider delivery (excl. weekends and bank holidays)</p>
                      </div>
                    </div>
                    <span className="font-inter text-sm">฿{DELIVERY_FEE.toLocaleString()}</span>
                  </label>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full bg-black text-white font-inter text-sm py-3.5 hover:bg-gray-800 transition-colors tracking-wide"
                >
                  Continue
                </button>
              </div>
            )}

            {step > 1 && (
              <div className="text-sm font-inter text-gray-400 -mt-4">
                {form.firstName} {form.lastName} · {form.address1}, {form.city} {form.postal}
              </div>
            )}
          </section>

          {/* Step 2: Payment */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-inter font-medium border ${step >= 2 ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-400'}`}>2</span>
              <h2 className={`font-inter text-sm tracking-widest uppercase ${step >= 2 ? 'text-black' : 'text-gray-300'}`}>Payment</h2>
            </div>
            {step === 2 && (
              <div className="space-y-4">
                <p className="font-inter text-sm text-gray-600 mb-3">Select Payment Method</p>

                {/* PromptPay QR option */}
                <label className="flex items-center justify-between border border-black rounded-sm px-4 py-3 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0">
                      <span className="w-2 h-2 rounded-full bg-black" />
                    </span>
                    <div>
                      <p className="font-inter text-sm">PromptPay QR</p>
                      <p className="font-inter text-xs text-gray-400">สแกน QR ผ่านแอปธนาคาร</p>
                    </div>
                  </div>
                  {/* PromptPay logo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/QR.png" alt="PromptPay" className="w-8 h-8 object-contain" />
                </label>

                <button
                  onClick={() => setStep(3)}
                  className="w-full bg-black text-white font-inter text-sm py-3.5 hover:bg-gray-800 transition-colors tracking-wide"
                >
                  Continue
                </button>
              </div>
            )}
          </section>

          {/* Step 3: Confirm */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-inter font-medium border ${step >= 3 ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-400'}`}>3</span>
              <h2 className={`font-inter text-sm tracking-widest uppercase ${step >= 3 ? 'text-black' : 'text-gray-300'}`}>Confirm &amp; Place Order</h2>
            </div>
            {step === 3 && (
              <button
                onClick={() => setShowQR(true)}
                className="w-full bg-black text-white font-inter text-sm py-3.5 hover:bg-gray-800 transition-colors tracking-wide"
              >
                Place Order
              </button>
            )}
          </section>
        </div>

        {/* RIGHT — Order summary */}
        <aside className="sticky top-8 space-y-6">

          {/* Order Summary */}
          <div className="border border-gray-100 p-6 space-y-4">
            <h3 className="font-serif text-lg">Order Summary</h3>
            <div className="space-y-2 text-sm font-inter">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Express Delivery</span>
                <span>฿{items.length > 0 ? DELIVERY_FEE.toLocaleString() : '–'}</span>
              </div>
              <div className="flex justify-between font-medium text-black pt-3 border-t border-gray-100">
                <span>Total To Pay</span>
                <span>฿{items.length > 0 ? total.toLocaleString() : '0'}</span>
              </div>
            </div>
          </div>

          {/* In Your Bag */}
          <div className="border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg">In Your Bag <span className="font-inter text-sm text-gray-400 ml-1">{items.length}</span></h3>
              <Link href="/" className="font-inter text-xs underline underline-offset-2 text-gray-500 hover:text-black transition-colors">Edit</Link>
            </div>

            {items.length === 0 ? (
              <p className="font-inter text-sm text-gray-400">Your bag is empty.</p>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-20 flex-shrink-0 bg-[#D8D8D8]">
                      {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />}
                    </div>
                    <div className="font-inter text-xs space-y-0.5 text-gray-600">
                      <p className="text-black text-sm">{item.name}</p>
                      <p>฿{item.price.toLocaleString()}</p>
                      <p className="text-gray-400">{item.description}</p>
                      <p>Qty: {item.quantity}</p>
                      <p className="text-black">Subtotal: ฿{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <p className="font-inter text-xs text-gray-400 mt-4 leading-relaxed">
              Online orders placed will be processed and dispatched within 2-3 working days
              (Monday – Friday excluding weekends and bank holidays) for all regions
            </p>
          </div>

          {/* Accordions */}
          {['Need Assistance?', 'FAQ'].map((label) => (
            <div key={label} className="border-t border-gray-100">
              <button
                onClick={() => setOpenAccordion(openAccordion === label ? null : label)}
                className="w-full flex items-center justify-between py-4 font-inter text-sm hover:opacity-60 transition-opacity"
              >
                {label}
                <svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                  className={`transition-transform duration-200 ${openAccordion === label ? 'rotate-180' : ''}`}
                >
                  <path d="M1 4l5 5 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
              {openAccordion === label && (
                <div className="pb-4 font-inter text-xs text-gray-400">
                  {label === 'Need Assistance?' ? 'Contact us at hello@worldbranded.com or call +66 2 123 4567.' : 'Visit our FAQ page for common questions about orders, shipping, and returns.'}
                </div>
              )}
            </div>
          ))}
        </aside>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-8 py-6">
        <div className="flex items-center justify-center gap-8 text-xs font-inter text-gray-400 mb-4">
          <a href="#" className="hover:text-black transition-colors">Shipping</a>
          <a href="#" className="hover:text-black transition-colors">Returns &amp; Refunds</a>
          <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
        </div>
        <div className="flex items-center justify-center gap-3 text-gray-400">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1a4 4 0 0 1 4 4c0 3-4 8-4 8S3 8 3 5a4 4 0 0 1 4-4Z" stroke="currentColor" strokeWidth="1.1"/><circle cx="7" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.1"/></svg>
          <span className="text-xs font-inter">Secure Checkout</span>
          <span className="font-inter text-xs text-gray-300">·</span>
          <span className="font-inter text-xs text-gray-300">VISA · Mastercard · AMEX · Apple Pay · PayPal</span>
        </div>
      </footer>

      <Footer />

      {showQR && (
        <QRPaymentModal
          amount={subtotal}
          deliveryFee={items.length > 0 ? DELIVERY_FEE : 0}
          total={total}
          customerName={`${form.firstName} ${form.lastName}`}
          phone={form.phone}
          address={{
            address1: form.address1,
            address2: form.address2,
            city: form.city,
            region: form.region,
            postal: form.postal,
          }}
          items={items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          }))}
          orderId={orderId}
          onSuccess={(transId) => {
            setTimeout(() => router.push(`/order-success?ref=${transId}`), 1500)
          }}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  )
}
