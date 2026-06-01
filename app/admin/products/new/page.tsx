'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/admin/ImageUploader'

interface UploadedImage { assetId: string; url: string; alt?: string }

const CATEGORIES = ['women', 'men', 'bags', 'accessories']
const TAGS = ['new-arrival', 'on-sale', 'featured']

export default function NewProduct() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', price: '', categories: [] as string[], description: '', inStock: true, tags: [] as string[],
  })
  const [images, setImages] = useState<UploadedImage[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }))
  const toggleTag = (tag: string) => {
    set('tags', form.tags.includes(tag) ? form.tags.filter(t => t !== tag) : [...form.tags, tag])
  }
  const toggleCategory = (cat: string) => {
    set('categories', form.categories.includes(cat) ? form.categories.filter(c => c !== cat) : [...form.categories, cat])
  }

  const save = async () => {
    if (!form.name || !form.price) { setError('กรุณากรอกชื่อและราคา'); return }
    setSaving(true)
    setError('')

    const slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')

    const res = await fetch('/api/admin/products/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        slug,
        price: Number(form.price),
        categories: form.categories,
        description: form.description,
        inStock: form.inStock,
        tags: form.tags,
        images: images.map(img => ({
          _type: 'image',
          asset: { _type: 'reference', _ref: img.assetId },
          alt: img.alt ?? '',
        })),
      }),
    })

    setSaving(false)
    if (res.ok) {
      router.push('/admin/products')
    } else {
      const d = await res.json()
      setError(d.error ?? 'เกิดข้อผิดพลาด')
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">เพิ่มสินค้าใหม่</h1>
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
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="เช่น Le City Bag Small"
            className="w-full border-b border-gray-200 font-inter text-sm py-1.5 outline-none focus:border-black transition-colors placeholder:text-gray-300" />
        </div>

        {/* ราคา */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">ราคา (฿) *</label>
          <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0"
            className="w-full border-b border-gray-200 font-inter text-sm py-1.5 outline-none focus:border-black transition-colors placeholder:text-gray-300" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">รายละเอียด</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            rows={4} placeholder="รายละเอียดสินค้า..."
            className="w-full border border-gray-200 font-inter text-sm p-2 outline-none focus:border-black transition-colors resize-none rounded-sm placeholder:text-gray-300" />
        </div>

        {/* Category — multi-select */}
        <div>
          <label className="block text-xs text-gray-400 mb-2">หมวดหมู่ (เลือกได้หลายอัน)</label>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => toggleCategory(c)}
                className={`text-xs px-3 py-1 rounded-full border capitalize transition-colors ${form.categories.includes(c) ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}>
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
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${form.tags.includes(t) ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}>
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

      {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

      <div className="flex justify-end mt-4">
        <button onClick={save} disabled={saving}
          className="bg-black text-white text-xs px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50">
          {saving ? 'กำลังบันทึก...' : 'เพิ่มสินค้า'}
        </button>
      </div>
    </div>
  )
}
