'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Order {
  id: string; orderRef: string; status: string
  total: number; createdAt: string; items: string
}

const STATUS: Record<string, { label: string; color: string }> = {
  paid:    { label: 'ชำระแล้ว', color: 'text-green-600' },
  pending: { label: 'รอชำระ', color: 'text-yellow-600' },
  failed:  { label: 'ล้มเหลว', color: 'text-red-500' },
}

export default function OrderHistoryPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/orders/user?email=${session.user.email}`)
      .then(r => r.json())
      .then(d => setOrders(d.orders ?? []))
  }, [session])

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Order History</h1>
      {orders.length === 0 ? (
        <p className="font-inter text-sm text-gray-400">ยังไม่มีออเดอร์</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="border border-gray-100 rounded-sm p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="font-inter text-xs text-gray-400">{o.orderRef}</p>
                <span className={`font-inter text-xs ${STATUS[o.status]?.color ?? 'text-gray-500'}`}>
                  {STATUS[o.status]?.label ?? o.status}
                </span>
              </div>
              <p className="font-inter text-sm font-medium">฿{o.total.toLocaleString()}</p>
              <p className="font-inter text-xs text-gray-400 mt-1">
                {new Date(o.createdAt).toLocaleDateString('th-TH')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
