/**
 * Verify a Sanity SVIX webhook signature.
 *
 * ต้องเพิ่ม env var ใน .env.local:
 *   SANITY_WEBHOOK_SECRET=<copy จาก Sanity dashboard → API → Webhooks>
 */
export async function isValidSignature(
  body: string,
  signature: string | null,
  secret: string,
): Promise<boolean> {
  if (!signature) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify', 'sign'],
  )

  // Sanity ส่ง signature เป็น hex string
  const sigBuffer = hexToUint8Array(signature).buffer as ArrayBuffer
  const bodyBuffer = encoder.encode(body).buffer as ArrayBuffer

  return crypto.subtle.verify('HMAC', key, sigBuffer, bodyBuffer)
}

function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}
