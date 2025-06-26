import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/authOptions'

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params

        await prisma.eventSuggestion.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to delete suggestion:', error)
        return NextResponse.json({ error: 'Failed to delete suggestion' }, { status: 500 })
    }
}