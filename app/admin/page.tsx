'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  totalOrders: number
  paidOrders: number
  pendingOrders: number
  totalRevenue: number
  todayOrders: number
  todayRevenue: number
}

interface Order {
  id: string
  orderRef: string
  customerName: string
  total: number
  status: string
  createdAt: string
}

const STATUS: Record<string, { label: string; color: string }> = {
  paid:        { label: 'ชำระแล้ว', color: 'bg-green-100 text-green-700' },
  pending:     { label: 'รอชำระ',   color: 'bg-yellow-100 text-yellow-700' },
  failed:      { label: 'ล้มเหลว', color: 'bg-red-100 text-red-700' },
  aml_pending: { label: 'รอ AML',   color: 'bg-blue-100 text-blue-700' },
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<Order[]>([])

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats)
    fetch('/api/orders?limit=5').then(r => r.json()).then(d => setRecent(d.orders ?? []))
  }, [])

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl mb-8">Overview</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'ยอดขายรวม', value: stats ? `฿${stats.totalRevenue.toLocaleString()}` : '—', sub: `${stats?.paidOrders ?? 0} orders` },
          { label: 'วันนี้', value: stats ? `฿${stats.todayRevenue.toLocaleString()}` : '—', sub: `${stats?.todayOrders ?? 0} orders` },
          { label: 'รอชำระ', value: stats?.pendingOrders ?? '—', sub: 'orders' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-sm p-6">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="font-serif text-3xl mb-0.5">{s.value}</p>
            <p className="text-xs text-gray-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-gray-100 rounded-sm">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="font-inter text-sm font-medium">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-gray-400 hover:text-black underline underline-offset-2">
            ดูทั้งหมด
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50">
              {['Order', 'ลูกค้า', 'ยอด', 'สถานะ', 'วันที่'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-medium text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-xs text-gray-400">ยังไม่มี order</td></tr>
            ) : recent.map((o) => (
              <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-6 py-3 text-xs text-gray-500">{o.orderRef}</td>
                <td className="px-6 py-3 text-xs">{o.customerName}</td>
                <td className="px-6 py-3 text-xs">฿{o.total.toLocaleString()}</td>
                <td className="px-6 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS[o.status]?.color ?? 'bg-gray-100 text-gray-500'}`}>
                    {STATUS[o.status]?.label ?? o.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-xs text-gray-400">
                  {new Date(o.createdAt).toLocaleDateString('th-TH')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
