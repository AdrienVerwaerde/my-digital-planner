// src/app/api/admin/users/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await prisma.user.delete({ where: { id: (await params).id } })
    return NextResponse.json({ success: true })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { name, role } = await req.json()
    const updated = await prisma.user.update({
        where: { id: (await params).id },
        data: { name, role }
    })
    return NextResponse.json(updated)
}