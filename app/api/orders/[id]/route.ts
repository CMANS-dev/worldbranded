import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json()
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        paidAt: status === 'paid' ? new Date() : undefined,
      },
    })
    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
