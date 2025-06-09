
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'


export async function POST(req: Request) {
    const session = await auth()
    const { eventId, isParticipating } = await req.json()

    if (!session?.user?.email || !eventId) {
        return NextResponse.json({ error: 'Unauthorized or invalid request' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    })

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    try {
        await prisma.userEvent.update({
            where: { id: eventId },
            data: {
                participants: isParticipating
                    ? { connect: { id: user.id } }
                    : { disconnect: { id: user.id } },
            },
        })

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Participation update error', err)
        return NextResponse.json({ error: 'Failed to update participation' }, { status: 500 })
    }
}
