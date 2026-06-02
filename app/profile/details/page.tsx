'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function ProfileDetailsPage() {
  const { data: session } = useSession()
  const [name, setName] = useState(session?.user?.name ?? '')
  const [msg, setMsg] = useState('')

  return (
    <div className="max-w-md">
      <h1 className="font-serif text-3xl mb-8">Profile Details</h1>
      <div className="space-y-5">
        <div>
          <label className="block font-inter text-xs text-gray-400 mb-1">ชื่อ-นามสกุล</label>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full border-b border-gray-200 font-inter text-sm py-1.5 outline-none focus:border-black transition-colors" />
        </div>
        <div>
          <label className="block font-inter text-xs text-gray-400 mb-1">อีเมล</label>
          <input value={session?.user?.email ?? ''} disabled
            className="w-full border-b border-gray-100 font-inter text-sm py-1.5 outline-none text-gray-400 cursor-not-allowed" />
        </div>
        {msg && <p className="font-inter text-xs text-gray-500">{msg}</p>}
        <button
          onClick={() => setMsg('✓ บันทึกแล้ว')}
          className="bg-black text-white font-inter text-xs px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
