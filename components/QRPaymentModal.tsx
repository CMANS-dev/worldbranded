'use client'

import { useEffect, useRef, useState } from 'react'


interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface Props {
  amount: number
  deliveryFee?: number
  total?: number
  customerName: string
  customerEmail?: string
  phone?: string
  address?: {
    address1?: string; address2?: string
    city?: string; region?: string; postal?: string
  }
  items?: CartItem[]
  orderId: string
  onSuccess: (transId: string) => void
  onClose: () => void
}

type Status = 'loading' | 'pending' | 'success' | 'failed' | 'error'

export default function QRPaymentModal({
  amount, deliveryFee = 0, total, customerName, customerEmail,
  phone, address, items = [], orderId, onSuccess, onClose,
}: Props) {
  const [status, setStatus] = useState<Status>('loading')
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [transId, setTransId] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(300) // 5 นาที
  const inquiredRef = useRef(false) // ยิง inquiry แค่ครั้งเดียว
  const ref1Ref = useRef<string>('')

  const saveOrder = async (txId: string, orderStatus: string) => {
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderRef: orderId,
          transId: txId,
          ref1: ref1Ref.current,
          status: orderStatus,
          amount,
          deliveryFee,
          total: total ?? amount + deliveryFee,
          customerName,
          customerEmail,
          phone,
          address1: address?.address1,
          address2: address?.address2,
          city: address?.city,
          region: address?.region,
          postal: address?.postal,
          items,
          paidAt: orderStatus === 'paid' ? new Date().toISOString() : null,
        }),
      })
    } catch (e) {
      console.error('Save order error:', e)
    }
  }

  // สร้าง QR code
  useEffect(() => {
    const createQR = async () => {
      try {
        // ref1 ต้องยาวไม่เกิน 18 ตัว
        const ref1 = Date.now().toString().slice(-18)
        ref1Ref.current = ref1
        const res = await fetch('/api/payment/create-qr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total ?? (amount + deliveryFee), // ส่งยอดรวมค่าส่ง
            ref1,
            ref3: customerName,
            orderId,
          }),
        })
        const data = await res.json()

        if (!res.ok || data.error) {
          setStatus('error')
          return
        }

        // ดึงข้อมูลจาก data object ของ gateway
        const payload = data.data ?? data
        setTransId(payload.trans_id)
        const img = payload.code_image ?? null
        setQrImage(img ? `data:image/png;base64,${img}` : null)
        setStatus('pending')
      } catch {
        setStatus('error')
      }
    }
    createQR()
  }, [amount, customerName, orderId])

  // Countdown timer — เมื่อครบ 5 นาที ยิง inquiry 1 ครั้ง
  useEffect(() => {
    if (status !== 'pending') return
    if (timeLeft <= 0) {
      // ครบเวลา — ยิง inquiry ครั้งเดียว
      if (!inquiredRef.current && transId) {
        inquiredRef.current = true
        fetch(`/api/payment/inquiry?trans_id=${transId}`)
          .then((r) => r.json())
          .then(async (data) => {
            // ใช้ paid field ที่ API เพิ่มให้
            const paid = data.paid === true
            if (paid) {
              await saveOrder(transId, 'paid')
              setStatus('success')
              onSuccess(transId)
            } else {
              await saveOrder(transId, 'failed')
              setStatus('failed')
            }
          })
          .catch(async () => {
            await saveOrder(transId, 'failed')
            setStatus('failed')
          })
      }
      return
    }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000)
    return () => clearTimeout(t)
  }, [status, timeLeft, transId, onSuccess])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm mx-4 relative">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-serif text-xl">PromptPay QR</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 text-center">

          {/* Loading */}
          {status === 'loading' && (
            <div className="py-12">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-inter text-sm text-gray-500">กำลังสร้าง QR Code...</p>
            </div>
          )}

          {/* Pending — แสดง QR */}
          {status === 'pending' && (
            <>
              <p className="font-inter text-sm text-gray-500 mb-1">ยอดชำระ</p>
              <p className="font-serif text-3xl mb-4">฿{amount.toLocaleString()}</p>

              {qrImage ? (
                <div className="w-64 h-64 mx-auto mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrImage} alt="QR Code" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-48 h-48 mx-auto mb-4 bg-gray-100 flex items-center justify-center">
                  <p className="font-inter text-xs text-gray-400">QR Code</p>
                </div>
              )}

              <p className="font-inter text-xs text-gray-400 mb-2">
                สแกนด้วยแอปธนาคาร
              </p>
              <p className={`font-inter text-sm font-medium ${timeLeft < 60 ? 'text-red-500' : 'text-gray-600'}`}>
                หมดอายุใน {minutes}:{seconds.toString().padStart(2, '0')}
              </p>

              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                <p className="font-inter text-xs text-gray-400">รอการชำระเงิน...</p>
              </div>
            </>
          )}

          {/* Success */}
          {status === 'success' && (
            <div className="py-8">
              <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                  <path d="M2 10l7 8L22 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="font-serif text-2xl mb-2">ชำระเงินสำเร็จ</p>
              <p className="font-inter text-sm text-gray-500">ขอบคุณสำหรับการสั่งซื้อ</p>
            </div>
          )}

          {/* Failed / Expired */}
          {(status === 'failed' || status === 'error') && (
            <div className="py-8">
              <p className="font-serif text-2xl mb-2">{status === 'failed' ? 'QR หมดอายุ' : 'เกิดข้อผิดพลาด'}</p>
              <p className="font-inter text-sm text-gray-500 mb-6">
                {status === 'failed' ? 'กรุณาลองใหม่อีกครั้ง' : 'ไม่สามารถสร้าง QR ได้ กรุณาลองใหม่'}
              </p>
              <button
                onClick={onClose}
                className="w-full border border-black font-inter text-sm py-3 rounded-full hover:bg-gray-50 transition-colors"
              >
                ปิด
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
