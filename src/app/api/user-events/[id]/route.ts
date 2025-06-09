import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'


export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }>}) {
    const session = await auth()

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true },
    })

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check ownership or admin privilege
    const event = await prisma.userEvent.findUnique({
        where: { id: (await params).id },
        select: { createdById: true },
    })

    if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const isOwner = event.createdById === user.id
    const isAdmin = user.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.userEvent.delete({ where: { id: (await params).id } })
    return NextResponse.json({ success: true })
}
