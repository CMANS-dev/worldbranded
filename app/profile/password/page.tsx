'use client'

import { useState } from 'react'

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const save = async () => {
    setError(''); setMsg('')
    if (form.newPass !== form.confirm) { setError('Password ไม่ตรงกัน'); return }
    if (form.newPass.length < 8) { setError('Password ต้องมีอย่างน้อย 8 ตัว'); return }
    setMsg('✓ เปลี่ยน password แล้ว')
  }

  return (
    <div className="max-w-md">
      <h1 className="font-serif text-3xl mb-8">Change Password</h1>
      <div className="space-y-5">
        {[
          { label: 'Password ปัจจุบัน', key: 'current' },
          { label: 'Password ใหม่', key: 'newPass' },
          { label: 'ยืนยัน Password ใหม่', key: 'confirm' },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="block font-inter text-xs text-gray-400 mb-1">{label}</label>
            <input type="password" value={form[key as keyof typeof form]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full border-b border-gray-200 font-inter text-sm py-1.5 outline-none focus:border-black transition-colors" />
          </div>
        ))}
        {error && <p className="font-inter text-xs text-red-500">{error}</p>}
        {msg && <p className="font-inter text-xs text-gray-500">{msg}</p>}
        <button onClick={save}
          className="bg-black text-white font-inter text-xs px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors">
          Update Password
        </button>
      </div>
    </div>
  )
}
