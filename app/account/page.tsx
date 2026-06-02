'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

type Tab = 'signin' | 'register'

// ── Reusable field ────────────────────────────────────────────────────────────
function Field({
  label, type = 'text', placeholder, value, onChange, hint, required = true,
}: {
  label: string; type?: string; placeholder?: string
  value: string; onChange: (v: string) => void
  hint?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block font-inter text-sm text-black mb-1">
        {label}{required && <span className="text-black">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-b border-gray-300 font-inter text-sm py-2 outline-none bg-transparent focus:border-black transition-colors placeholder:text-gray-300"
      />
      {hint && <p className="font-inter text-xs text-gray-400 mt-1 leading-relaxed">{hint}</p>}
    </div>
  )
}

// ── Sign In form ──────────────────────────────────────────────────────────────
function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    const res = await signIn('credentials', {
      email, password, redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      setError('Email or password is incorrect.')
    } else {
      router.push('/profile')
    }
  }

  return (
    <div className="space-y-6">
      <Field label="Email" type="email" value={email} onChange={setEmail} />
      <Field label="Password" type="password" value={password} onChange={setPassword} />

      {error && <p className="font-inter text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setRemember(!remember)}
            className={`w-5 h-5 border border-black flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${remember ? 'bg-black' : 'bg-white'}`}
          >
            {remember && (
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path d="M1 4l3 3.5L10 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="font-inter text-sm">Remember me</span>
        </label>
        <a href="#" className="font-inter text-sm underline underline-offset-2 hover:opacity-60 transition-opacity">
          Forgot password?
        </a>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white font-inter text-sm py-3.5 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </div>
  )
}

// ── Register form ─────────────────────────────────────────────────────────────
function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    confirmEmail: '', password: '', confirmPassword: '',
  })
  const [agreed, setAgreed] = useState(false)
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (v: string) => setForm({ ...form, [k]: v })

  const handleSubmit = async () => {
    setError('')
    if (form.email !== form.confirmEmail) { setError('Emails do not match.'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    if (!agreed || !ageConfirmed) { setError('Please agree to the terms.'); return }

    setLoading(true)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setError(data.error || 'Something went wrong.'); return }

    // auto login แล้ว redirect ไป profile
    const loginRes = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })
    if (loginRes?.ok) {
      onSuccess()
    } else {
      onSuccess() // สลับไป Sign In ให้ login เอง
    }
  }

  return (
    <div className="space-y-6">
      <Field label="First Name" value={form.firstName} onChange={set('firstName')} />
      <Field label="Last Name" value={form.lastName} onChange={set('lastName')} />

      {/* Phone with flag */}
      <div>
        <label className="block font-inter text-sm text-black mb-1">Phone Number*</label>
        <div className="flex items-center gap-2 border-b border-gray-300 py-2">
          <span className="font-inter text-sm flex items-center gap-1 text-gray-600">
            🇹🇭
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set('phone')(e.target.value)}
            placeholder="081 234 5678"
            className="flex-1 font-inter text-sm outline-none bg-transparent placeholder:text-gray-300"
          />
        </div>
      </div>

      <Field label="Email" type="email" value={form.email} onChange={set('email')} />
      <Field label="Confirm Email" type="email" value={form.confirmEmail} onChange={set('confirmEmail')} />
      <Field
        label="Password" type="password" value={form.password} onChange={set('password')}
        hint="Password must be 8 or more characters, including at least one capital letter, one number and one special character."
      />
      <Field label="Confirm Password" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} />

      {/* Checkboxes */}
      <div className="space-y-3 pt-1">
        <label className="flex items-start gap-3 cursor-pointer" onClick={() => setAgreed(!agreed)}>
          <div className={`w-5 h-5 border border-black flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${agreed ? 'bg-black' : 'bg-white'}`}>
            {agreed && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4l3 3.5L10 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <span className="font-inter text-sm leading-relaxed">
            I agree to <a href="#" className="underline underline-offset-2">Terms &amp; Conditions</a> and <a href="#" className="underline underline-offset-2">Privacy Policy</a>. *
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer" onClick={() => setAgeConfirmed(!ageConfirmed)}>
          <div className={`w-5 h-5 border border-black flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${ageConfirmed ? 'bg-black' : 'bg-white'}`}>
            {ageConfirmed && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4l3 3.5L10 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <span className="font-inter text-sm">I confirm that I am at least 16 years old. *</span>
        </label>
      </div>

      {error && <p className="font-inter text-sm text-red-500">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white font-inter text-sm py-3.5 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const [tab, setTab] = useState<Tab>('signin')
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-14 flex flex-col items-center">
        {/* Logo */}
        <h1 className="font-serif text-4xl md:text-5xl mt-12 md:mt-16 mb-10 md:mb-14 tracking-tight">worldbranded®</h1>

        {/* Tab switcher */}
        <div className="w-full max-w-md px-4 md:px-4">
          <div className="grid grid-cols-2 mb-8">
            <button
              onClick={() => setTab('signin')}
              className="relative pb-3 font-serif text-2xl text-black transition-opacity hover:opacity-60"
            >
              Sign In
              <span className={`absolute bottom-0 left-0 right-0 h-px bg-black transition-opacity duration-200 ${tab === 'signin' ? 'opacity-100' : 'opacity-0'}`} />
            </button>
            <button
              onClick={() => setTab('register')}
              className="relative pb-3 font-serif text-2xl text-black transition-opacity hover:opacity-60"
            >
              Create Account
              <span className={`absolute bottom-0 left-0 right-0 h-px bg-black transition-opacity duration-200 ${tab === 'register' ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          </div>

          {/* Forms */}
          <div className="pb-20">
            {tab === 'signin'
              ? <SignInForm />
              : <RegisterForm onSuccess={() => router.push('/profile')} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
