'use client'

import { useEffect, useState } from 'react'

interface Order {
  id: string; orderRef: string; transId?: string; status: string
  amount: number; deliveryFee: number; total: number
  customerName: string; customerEmail?: string; phone?: string
  address1?: string; city?: string; postal?: string
  items: string; createdAt: string; paidAt?: string
}

const STATUS: Record<string, { label: string; color: string }> = {
  paid:        { label: 'ชำระแล้ว', color: 'bg-green-100 text-green-700' },
  pending:     { label: 'รอชำระ',   color: 'bg-yellow-100 text-yellow-700' },
  failed:      { label: 'ล้มเหลว', color: 'bg-red-100 text-red-700' },
  aml_pending: { label: 'รอ AML',   color: 'bg-blue-100 text-blue-700' },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Order | null>(null)
  const limit = 20

  const fetchOrders = async () => {
    setLoading(true)
    const p = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (filter) p.set('status', filter)
    const res = await fetch(`/api/orders?${p}`)
    const data = await res.json()
    setOrders(data.orders ?? [])
    setTotal(data.total ?? 0)
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [page, filter])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchOrders()
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Orders</h1>
        <button onClick={fetchOrders} className="text-xs text-gray-400 hover:text-black">↻ Refresh</button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {[['', 'ทั้งหมด'], ['paid', 'ชำระแล้ว'], ['pending', 'รอชำระ'], ['failed', 'ล้มเหลว'], ['aml_pending', 'รอ AML']].map(([v, l]) => (
          <button key={v} onClick={() => { setFilter(v); setPage(1) }}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${filter === v ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400">กำลังโหลด...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Order', 'วันที่', 'ลูกค้า', 'ยอด', 'สถานะ', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-xs text-gray-400">ไม่มี order</td></tr>
              ) : orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-500">{o.orderRef}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(o.createdAt).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td className="px-4 py-3 text-xs">{o.customerName}</td>
                  <td className="px-4 py-3 text-xs">฿{o.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS[o.status]?.color ?? 'bg-gray-100 text-gray-500'}`}>
                      {STATUS[o.status]?.label ?? o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(o)} className="text-xs text-gray-400 hover:text-black underline underline-offset-2">ดูรายละเอียด</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {Math.ceil(total / limit) > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-7 h-7 text-xs rounded-full border ${page === p ? 'bg-black text-white border-black' : 'border-gray-300'}`}>{p}</button>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-lg rounded-sm p-6 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="font-serif text-xl">{selected.orderRef}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selected.transId ?? 'ยังไม่มี trans_id'}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-black">✕</button>
            </div>

            <div className="space-y-4 text-sm">
              {/* Status change */}
              <div>
                <p className="text-xs text-gray-400 mb-2">เปลี่ยนสถานะ</p>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(STATUS).map(([v, { label, color }]) => (
                    <button key={v} onClick={() => updateStatus(selected.id, v)}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${selected.status === v ? `${color} border-transparent` : 'border-gray-200 hover:border-black'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                <div><p className="text-xs text-gray-400 mb-0.5">ลูกค้า</p><p>{selected.customerName}</p></div>
                <div><p className="text-xs text-gray-400 mb-0.5">อีเมล</p><p>{selected.customerEmail ?? '-'}</p></div>
                <div><p className="text-xs text-gray-400 mb-0.5">โทรศัพท์</p><p>{selected.phone ?? '-'}</p></div>
                <div><p className="text-xs text-gray-400 mb-0.5">เมือง</p><p>{selected.city ?? '-'}</p></div>
                <div><p className="text-xs text-gray-400 mb-0.5">วันที่สั่ง</p><p>{new Date(selected.createdAt).toLocaleString('th-TH')}</p></div>
                <div><p className="text-xs text-gray-400 mb-0.5">วันที่ชำระ</p><p>{selected.paidAt ? new Date(selected.paidAt).toLocaleString('th-TH') : '-'}</p></div>
              </div>

              {/* Items */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 mb-2">สินค้า</p>
                {(() => { try {
                  return JSON.parse(selected.items).map((item: any, i: number) => (
                    <div key={i} className="flex justify-between py-1 text-xs">
                      <span>{item.name} x{item.quantity}</span>
                      <span>฿{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))
                } catch { return <p className="text-xs text-gray-400">-</p> } })()}
              </div>

              {/* Total */}
              <div className="border-t border-gray-100 pt-3 space-y-1 text-xs">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>฿{selected.amount.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-500"><span>Delivery</span><span>฿{selected.deliveryFee.toLocaleString()}</span></div>
                <div className="flex justify-between font-medium text-sm pt-1 border-t border-gray-100"><span>Total</span><span>฿{selected.total.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
