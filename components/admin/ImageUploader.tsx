'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

interface UploadedImage {
  assetId: string
  url: string
  alt?: string
}

interface Props {
  images: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
}

export default function ImageUploader({ images, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const upload = async (files: FileList) => {
    setUploading(true)
    const uploaded: UploadedImage[] = []

    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.assetId) uploaded.push({ assetId: data.assetId, url: data.url, alt: '' })
    }

    onChange([...images, ...uploaded])
    setUploading(false)
  }

  const remove = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx))
  }

  const updateAlt = (idx: number, alt: string) => {
    onChange(images.map((img, i) => i === idx ? { ...img, alt } : img))
  }

  return (
    <div>
      {/* Image grid */}
      <div className="flex gap-3 flex-wrap mb-3">
        {images.map((img, i) => (
          <div key={img.assetId} className="relative group">
            <div className="relative w-24 h-24 bg-gray-100">
              <Image src={img.url} alt={img.alt ?? ''} fill className="object-cover" sizes="96px" unoptimized />
            </div>
            {/* Remove button */}
            <button
              onClick={() => remove(i)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
            {/* Alt text */}
            <input
              value={img.alt ?? ''}
              onChange={e => updateAlt(i, e.target.value)}
              placeholder="alt text"
              className="mt-1 w-24 text-xs border-b border-gray-200 outline-none py-0.5 focus:border-black"
            />
          </div>
        ))}

        {/* Upload button */}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 border-2 border-dashed border-gray-200 hover:border-black transition-colors flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-black disabled:opacity-50"
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span className="text-2xl">+</span>
              <span className="text-xs">อัปรูป</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => e.target.files && upload(e.target.files)}
      />
      <p className="text-xs text-gray-400">รองรับ JPG, PNG, WebP — ลากเรียงลำดับได้</p>
    </div>
  )
}
