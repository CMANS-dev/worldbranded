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
  total: number
  amount: number
  deliveryFee: number
  status: string
  amlStatus?: string
  transId?: string
  items?: string
}) {
  const statusEmoji: Record<string, string> = {
    paid: '✅',
    pending: '⏳',
    failed: '❌',
    aml_pending: '🔍',
  }

  let itemsText = ''
  if (order.items) {
    try {
      const parsed = JSON.parse(order.items)
      itemsText = parsed.map((i: any) => `  • ${i.name} x${i.quantity}`).join('\n')
    } catch {}
  }

  return `${statusEmoji[order.status] ?? '🔔'} <b>Order ${order.status.toUpperCase()}</b>

📦 <b>${order.orderRef}</b>
👤 ${order.customerName}
💰 ฿${order.total.toLocaleString()} (สินค้า ฿${order.amount.toLocaleString()} + ส่ง ฿${order.deliveryFee.toLocaleString()})
${itemsText ? `\n🛍 รายการ:\n${itemsText}` : ''}
${order.amlStatus ? `🔍 AML: ${order.amlStatus}` : ''}
${order.transId ? `🔑 Trans: <code>${order.transId}</code>` : ''}

🕐 ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}`
}
