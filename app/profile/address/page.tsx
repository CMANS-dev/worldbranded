'use client'

import { useState, useEffect } from 'react'

interface Address {
  id: string; name: string; firstName: string; lastName: string
  phone: string; company?: string; address1: string; address2?: string
  city: string; region?: string; postal: string
  isDefaultShipping: boolean; isDefaultBilling: boolean
}

const emptyForm = {
  name: '', firstName: '', lastName: '', phone: '',
  company: '', address1: '', address2: '', city: '', region: '', postal: '',
  isDefaultShipping: false, isDefaultBilling: false,
}

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/addresses').then(r => r.json()).then(setAddresses)
  }, [])

  const set = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.name || !form.firstName || !form.lastName || !form.address1 || !form.city || !form.postal) {
      setMsg('กรุณากรอกข้อมูลที่จำเป็น'); return
    }
    setSaving(true)
    const res = await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) {
      const data = await res.json()
      setAddresses(prev => [data.address, ...prev])
      setShowForm(false)
      setForm(emptyForm)
      setMsg('')
    } else {
      setMsg('เกิดข้อผิดพลาด ลองใหม่อีกครั้ง')
    }
  }

  return (
    <div className="max-w-lg">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl">Address Book</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="font-inter text-xs bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
            + Add New Address
          </button>
        )}
      </div>

      {/* รายการที่อยู่ */}
      {!showForm && (
        <div className="space-y-3 mb-6">
          {addresses.length === 0 ? (
            <p className="font-inter text-sm text-gray-400">ยังไม่มีที่อยู่ที่บันทึกไว้</p>
          ) : addresses.map((a) => (
            <div key={a.id} className="border border-gray-100 rounded-sm p-4">
              <p className="font-inter text-sm font-medium">{a.name}</p>
              <p className="font-inter text-xs text-gray-500 mt-1">
                {a.firstName} {a.lastName} · {a.phone}
              </p>
              <p className="font-inter text-xs text-gray-500">
                {a.address1}{a.address2 ? `, ${a.address2}` : ''}, {a.city} {a.postal}
              </p>
              {(a.isDefaultShipping || a.isDefaultBilling) && (
                <div className="flex gap-2 mt-2">
                  {a.isDefaultShipping && <span className="font-inter text-xs bg-gray-100 px-2 py-0.5 rounded-full">Default Shipping</span>}
                  {a.isDefaultBilling && <span className="font-inter text-xs bg-gray-100 px-2 py-0.5 rounded-full">Default Billing</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div>
          <h2 className="font-inter text-sm font-medium tracking-widest uppercase mb-6">ADD NEW ADDRESS</h2>
          <div className="space-y-4">
            {[
              { label: 'Address Name', key: 'name' },
              { label: 'First Name', key: 'firstName' },
              { label: 'Last Name', key: 'lastName' },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block font-inter text-xs text-gray-500 mb-1">{label} *</label>
                <input value={form[key as keyof typeof form] as string}
                  onChange={e => set(key as keyof typeof form, e.target.value)}
                  className="w-full border-b border-gray-200 font-inter text-sm py-1.5 outline-none focus:border-black transition-colors" />
              </div>
            ))}

            <div>
              <label className="block font-inter text-xs text-gray-500 mb-1">Phone Number *</label>
              <div className="flex items-center gap-2 border-b border-gray-200 py-1.5">
                <span className="font-inter text-sm">🇹🇭 +66</span>
                <input value={form.phone} onChange={e => set('phone', e.target.value)}
                  placeholder="081 234 5678"
                  className="flex-1 font-inter text-sm outline-none bg-transparent placeholder:text-gray-300" />
              </div>
            </div>

            <div>
              <label className="block font-inter text-xs text-gray-500 mb-1">Company Name <span className="text-gray-300">(optional)</span></label>
              <input value={form.company} onChange={e => set('company', e.target.value)}
                className="w-full border-b border-gray-200 font-inter text-sm py-1.5 outline-none focus:border-black transition-colors" />
            </div>

            <div>
              <label className="block font-inter text-xs text-gray-500 mb-1">Address Line 1 *</label>
              <input value={form.address1} onChange={e => set('address1', e.target.value)}
                className="w-full border-b border-gray-200 font-inter text-sm py-1.5 outline-none focus:border-black transition-colors" />
            </div>

            <div>
              <label className="block font-inter text-xs text-gray-500 mb-1">Address Line 2 <span className="text-gray-300">(optional)</span></label>
              <input value={form.address2} onChange={e => set('address2', e.target.value)}
                className="w-full border-b border-gray-200 font-inter text-sm py-1.5 outline-none focus:border-black transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-inter text-xs text-gray-500 mb-1">City *</label>
                <input value={form.city} onChange={e => set('city', e.target.value)}
                  className="w-full border-b border-gray-200 font-inter text-sm py-1.5 outline-none focus:border-black transition-colors" />
              </div>
              <div>
                <label className="block font-inter text-xs text-gray-500 mb-1">Region <span className="text-gray-300">(optional)</span></label>
                <input value={form.region} onChange={e => set('region', e.target.value)}
                  className="w-full border-b border-gray-200 font-inter text-sm py-1.5 outline-none focus:border-black transition-colors" />
              </div>
            </div>

            <div>
              <label className="block font-inter text-xs text-gray-500 mb-1">Postal Code *</label>
              <input value={form.postal} onChange={e => set('postal', e.target.value)}
                placeholder="Example: 10110"
                className="w-full border-b border-gray-200 font-inter text-sm py-1.5 outline-none focus:border-black transition-colors placeholder:text-gray-300" />
            </div>

            <div className="space-y-3 pt-2">
              {[
                { key: 'isDefaultShipping', label: 'Set as Default Shipping Address' },
                { key: 'isDefaultBilling', label: 'Set as Default Billing Address' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer" onClick={() => set(key as keyof typeof form, !form[key as keyof typeof form])}>
                  <div className={`w-4 h-4 border border-black flex items-center justify-center transition-colors ${form[key as keyof typeof form] ? 'bg-black' : 'bg-white'}`}>
                    {form[key as keyof typeof form] && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3l2.5 3L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span className="font-inter text-sm">{label}</span>
                </label>
              ))}
            </div>

            {msg && <p className="font-inter text-xs text-red-500">{msg}</p>}

            <div className="flex gap-3 pt-2">
              <button onClick={save} disabled={saving}
                className="font-inter text-xs bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50">
                {saving ? 'กำลังบันทึก...' : 'Save Address'}
              </button>
              <button onClick={() => { setShowForm(false); setMsg('') }}
                className="font-inter text-xs border border-black px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
