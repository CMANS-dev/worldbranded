export async function sendTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })
  } catch (e) {
    console.error('Telegram notify error:', e)
  }
}

export function orderNotifyMessage(order: {
  orderRef: string
  customerName: string
  customerEmail?: string
  total: number
  amount: number
  deliveryFee: number
  status: string
  amlStatus?: string
  transId?: string
  ref1?: string
  items?: string
}) {
  const statusLabel: Record<string, string> = {
    pending:     'ถูกสั่งซื้อ',
    paid:        'ชำระเงินแล้ว',
    failed:      'รายการไม่สำเร็จ',
    aml_pending: 'รอตรวจสอบ AML',
    cancelled:   'ยกเลิกแล้ว',
    refunded:    'คืนเงินแล้ว',
    processing:  'กำลังจัดเตรียม',
    shipped:     'จัดส่งแล้ว',
    delivered:   'ได้รับสินค้าแล้ว',
  }

  const statusText = statusLabel[order.status] ?? order.status

  return `ร้านค้า : worldbranded.com
Email : ${order.customerEmail ?? '-'}
OrderID(ref2) : ${order.orderRef}
TXNID(ref1) : ${order.ref1 ?? order.transId ?? '-'}
Amount : ฿${order.total.toLocaleString()}
${statusText}`
}
