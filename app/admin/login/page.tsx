'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async () => {
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (res.ok) {
      router.push('/admin')
    } else {
      setError('รหัสผ่านไม่ถูกต้อง')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-100 rounded-sm p-8 w-full max-w-xs">
        <h1 className="font-serif text-2xl mb-1">worldbranded®</h1>
        <p className="font-inter text-xs text-gray-400 mb-6">Admin</p>

        <div className="space-y-4">
          <div>
            <label className="block font-inter text-xs text-gray-400 mb-1">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              autoFocus
              className="w-full border-b border-gray-200 font-inter text-sm py-1.5 outline-none focus:border-black transition-colors"
            />
          </div>

          {error && <p className="font-inter text-xs text-red-500">{error}</p>}

          <button
            onClick={login}
            disabled={loading || !password}
            className="w-full bg-black text-white font-inter text-xs py-2.5 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </div>
      </div>
    </div>
  )
}
