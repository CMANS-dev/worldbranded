'use client'

import { useEffect, useRef, useState } from 'react'

export default function FooterWordmark() {
  const textRef = useRef<HTMLSpanElement>(null)
  const [fontSize, setFontSize] = useState(200)

  useEffect(() => {
    const fit = () => {
      if (!textRef.current) return
      // วัด ratio ของ text ที่ font size 200 แล้วคำนวณ font size ใหม่ให้พอดี window
      const currentWidth = textRef.current.scrollWidth
      const newSize = (200 * window.innerWidth) / currentWidth
      setFontSize(newSize)
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <div className="select-none leading-none overflow-hidden w-full">
      <span
        ref={textRef}
        className="font-serif text-black whitespace-nowrap inline-block"
        style={{ fontSize, lineHeight: 0.85 }}
      >
        worldbranded®
      </span>
    </div>
  )
}
