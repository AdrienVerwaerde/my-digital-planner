import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { auth } from '../../../../../auth'

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { activity, location, date } = await req.json()

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const event = await prisma.event.create({
            data: {
                activity,
                locations: { connect: { id: location } },
                date: new Date(date),
                createdById: user.id,
            },
        })

        return NextResponse.json(event)
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
