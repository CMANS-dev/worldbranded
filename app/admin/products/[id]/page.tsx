'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ImageUploader from '@/components/admin/ImageUploader'

interface UploadedImage { assetId: string; url: string; alt?: string }

interface Product {
  _id: string; name: string; slug: string; price: number
  categories?: string[]; inStock: boolean; description?: string
  brand?: string; tags?: string[]
  images?: { url: string; alt?: string; assetId?: string; _ref?: string }[]
}

const CATEGORIES = ['women', 'men', 'bags', 'accessories']
const TAGS = ['new-arrival', 'on-sale', 'featured']

export default function EditProduct() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<Product>>({})
  const [images, setImages] = useState<UploadedImage[]>([])
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/admin/products')
      .then(r => r.json())
      .then((products: Product[]) => {
        const p = products.find(p => p._id === id)
        if (p) {
          setForm(p)
          setImages((p.images ?? []).map(img => ({
            assetId: img.assetId ?? img._ref ?? '',
            url: img.url,
            alt: img.alt ?? '',
          })))
        }
        setLoading(false)
      })
  }, [id])

  const set = (k: keyof Product, v: any) => setForm(f => ({ ...f, [k]: v }))
  const toggleTag = (tag: string) => {
    const tags = form.tags ?? []
    set('tags', tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag])
  }
  const toggleCategory = (cat: string) => {
    const cats = form.categories ?? []
    set('categories', cats.includes(cat) ? cats.filter(c => c !== cat) : [...cats, cat])
  }

  const save = async () => {
    setSaving(true)
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        categories: form.categories ?? [],
        inStock: form.inStock,
        description: form.description,
        tags: form.tags,
        // ส่ง images เป็น Sanity asset reference format
        images: images.map(img => ({
          _type: 'image',
          asset: { _type: 'reference', _ref: img.assetId },
          alt: img.alt ?? '',
        })),
      }),
    })
    setSaving(false)
    setMsg(res.ok ? '✓ บันทึกแล้ว' : '✗ เกิดข้อผิดพลาด')
    setTimeout(() => setMsg(''), 3000)
  }

  const del = async () => {
    if (!confirm(`ลบสินค้า "${form.name}"?`)) return
    setDeleting(true)
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    router.push('/admin/products')
  }

  if (loading) return <div className="p-8 text-sm text-gray-400">กำลังโหลด...</div>

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">แก้ไขสินค้า</h1>
        <button onClick={() => router.back()} className="text-xs text-gray-400 hover:text-black">← กลับ</button>
      </div>

      <div className="space-y-5 bg-white border border-gray-100 rounded-sm p-6">
        {/* รูปภาพ */}
        <div>
          <label className="block text-xs text-gray-400 mb-2">รูปภาพ</label>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* ชื่อ */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">ชื่อสินค้า *</label>
          <input value={form.name ?? ''} onChange={e => set('name', e.target.value)}
            className="w-full border-b border-gray-200 font-inter text-sm py-1.5 outline-none focus:border-black transition-colors" />
        </div>

        {/* ราคา */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">ราคา (฿)</label>
          <input type="number" value={form.price ?? ''} onChange={e => set('price', e.target.value)}
            className="w-full border-b border-gray-200 font-inter text-sm py-1.5 outline-none focus:border-black transition-colors" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">รายละเอียด</label>
          <textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)}
            rows={4} className="w-full border border-gray-200 font-inter text-sm p-2 outline-none focus:border-black transition-colors resize-none rounded-sm" />
        </div>

        {/* Category — multi-select */}
        <div>
          <label className="block text-xs text-gray-400 mb-2">หมวดหมู่ (เลือกได้หลายอัน)</label>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => toggleCategory(c)}
                className={`text-xs px-3 py-1 rounded-full border capitalize transition-colors ${form.categories?.includes(c) ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs text-gray-400 mb-2">Tags</label>
          <div className="flex gap-2 flex-wrap">
            {TAGS.map(t => (
              <button key={t} onClick={() => toggleTag(t)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${form.tags?.includes(t) ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Stock */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-400">สต็อก</label>
          <button onClick={() => set('inStock', !form.inStock)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${form.inStock ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
            {form.inStock ? 'In Stock' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4">
        <button onClick={del} disabled={deleting} className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50">
          {deleting ? 'กำลังลบ...' : 'ลบสินค้า'}
        </button>
        <div className="flex items-center gap-3">
          {msg && <span className="text-xs text-gray-500">{msg}</span>}
          <button onClick={save} disabled={saving}
            className="bg-black text-white text-xs px-5 py-2 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50">
            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>
    </div>
  )
}
