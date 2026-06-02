import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json([], { status: 401 })

    const addresses = await (prisma as any).address.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(addresses)
  } catch { return NextResponse.json([]) }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const address = await (prisma as any).address.create({
      data: {
        id: crypto.randomUUID(),
        userId: session.user.id,
        name: body.name,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        company: body.company || null,
        address1: body.address1,
        address2: body.address2 || null,
        city: body.city,
        region: body.region || null,
        postal: body.postal,
        isDefaultShipping: body.isDefaultShipping ?? false,
        isDefaultBilling: body.isDefaultBilling ?? false,
      },
    })
    return NextResponse.json({ success: true, address }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
