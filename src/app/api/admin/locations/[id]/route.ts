
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
    _: NextRequest,
    { params }: { params: { id: string } }
) {
    await prisma.location.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
}
