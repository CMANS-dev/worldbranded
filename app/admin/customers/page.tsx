'use client'

import { useEffect, useState } from 'react'

interface Customer {
  id: string; name?: string; email: string
  createdAt: string; _count?: { orders: number }
  totalSpent?: number
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/customers')
      .then(r => r.json())
      .then(data => { setCustomers(data); setLoading(false) })
  }, [])

  const filtered = customers.filter(c =>
    !search ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl mb-6">Customers</h1>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="ค้นหาลูกค้า..."
        className="border border-gray-200 rounded-full px-4 py-2 text-sm font-inter w-64 outline-none focus:border-black mb-4 transition-colors"
      />

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400">กำลังโหลด...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['ชื่อ', 'อีเมล', 'วันที่สมัคร', 'Orders', 'ยอดรวม'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-16 text-center text-xs text-gray-400">ไม่มีลูกค้า</td></tr>
              ) : filtered.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs font-medium">{c.name ?? '-'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{c.email}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString('th-TH')}</td>
                  <td className="px-4 py-3 text-xs">{c._count?.orders ?? 0}</td>
                  <td className="px-4 py-3 text-xs">฿{(c.totalSpent ?? 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
