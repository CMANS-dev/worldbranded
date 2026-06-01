'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface Brand {
  _id: string; name: string; slug: string
  description?: string; logo?: string; productCount?: number
}

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Brand | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  // form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [logoAssetId, setLogoAssetId] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetch_ = () => {
    setLoading(true)
    fetch('/api/admin/brands').then(r => r.json()).then(data => {
      setBrands(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }

  useEffect(() => { fetch_() }, [])

  const openEdit = (b: Brand) => {
    setSelected(b); setShowNew(false)
    setName(b.name); setDescription(b.description ?? '')
    setLogoUrl(b.logo ?? ''); setLogoAssetId('')
  }

  const openNew = () => {
    setSelected(null); setShowNew(true)
    setName(''); setDescription(''); setLogoUrl(''); setLogoAssetId('')
  }

  const uploadLogo = async (file: File) => {
    setUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.assetId) { setLogoAssetId(data.assetId); setLogoUrl(data.url) }
    setUploading(false)
  }

  const save = async () => {
    if (!name) return
    setSaving(true)
    const body = { name, description, logoAssetId: logoAssetId || undefined }

    const res = selected
      ? await fetch(`/api/admin/brands/${selected._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      : await fetch('/api/admin/brands', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

    setSaving(false)
    if (res.ok) {
      setMsg('✓ บันทึกแล้ว')
      setTimeout(() => setMsg(''), 2000)
      fetch_()
      if (!selected) { setShowNew(false) }
    }
  }

  const del = async () => {
    if (!selected || !confirm(`ลบ "${selected.name}"?`)) return
    await fetch(`/api/admin/brands/${selected._id}`, { method: 'DELETE' })
    setSelected(null); fetch_()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Brands</h1>
        <button onClick={openNew} className="bg-black text-white text-xs px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
          + เพิ่มแบรนด์
        </button>
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-6 items-start">
        {/* List */}
        <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs text-gray-400">กำลังโหลด...</div>
          ) : brands.length === 0 ? (
            <div className="py-20 text-center text-xs text-gray-400">ยังไม่มีแบรนด์</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['', 'ชื่อแบรนด์', 'สินค้า', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {brands.map((b) => (
                  <tr key={b._id} className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${selected?._id === b._id ? 'bg-gray-50' : ''}`}
                    onClick={() => openEdit(b)}>
                    <td className="px-4 py-3 w-10">
                      {b.logo ? (
                        <div className="relative w-8 h-8 bg-gray-100">
                          <Image src={b.logo} alt={b.name} fill className="object-contain" sizes="32px" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-serif">
                          {b.name[0]}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium">{b.name}</p>
                      {b.description && <p className="text-xs text-gray-400 truncate max-w-[200px]">{b.description}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{b.productCount ?? 0} สินค้า</td>
                    <td className="px-4 py-3 text-xs text-gray-300">→</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Form panel */}
        {(selected || showNew) && (
          <div className="bg-white border border-gray-100 rounded-sm p-5 sticky top-6">
            <h2 className="font-serif text-lg mb-4">{selected ? 'แก้ไขแบรนด์' : 'เพิ่มแบรนด์ใหม่'}</h2>

            <div className="space-y-4">
              {/* Logo */}
              <div>
                <label className="block text-xs text-gray-400 mb-2">โลโก้</label>
                <div className="flex items-center gap-3">
                  {logoUrl ? (
                    <div className="relative w-16 h-16 bg-gray-100">
                      <Image src={logoUrl} alt="logo" fill className="object-contain" sizes="64px" unoptimized />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                      {name ? name[0] : '?'}
                    </div>
                  )}
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="text-xs border border-gray-200 px-3 py-1.5 rounded-full hover:border-black transition-colors disabled:opacity-50">
                    {uploading ? 'อัปโหลด...' : 'เลือกรูป'}
                  </button>
                  {logoUrl && (
                    <button onClick={() => { setLogoUrl(''); setLogoAssetId('') }}
                      className="text-xs text-red-400 hover:text-red-600">ลบ</button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">ชื่อแบรนด์ *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="เช่น Balenciaga"
                  className="w-full border-b border-gray-200 text-sm py-1.5 outline-none focus:border-black transition-colors font-inter placeholder:text-gray-300" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">รายละเอียด</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}
                  rows={3} placeholder="เกี่ยวกับแบรนด์..."
                  className="w-full border border-gray-200 text-sm p-2 outline-none focus:border-black transition-colors resize-none rounded-sm font-inter placeholder:text-gray-300" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
              {selected ? (
                <button onClick={del} className="text-xs text-red-400 hover:text-red-600 transition-colors">ลบแบรนด์</button>
              ) : (
                <button onClick={() => setShowNew(false)} className="text-xs text-gray-400 hover:text-black">ยกเลิก</button>
              )}
              <div className="flex items-center gap-3">
                {msg && <span className="text-xs text-gray-500">{msg}</span>}
                <button onClick={save} disabled={saving || !name}
                  className="bg-black text-white text-xs px-4 py-2 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50">
                  {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
