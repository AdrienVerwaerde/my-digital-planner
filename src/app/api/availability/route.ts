import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '../../../../auth'

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { date } = await req.json()

    try {
        await prisma.availability.upsert({
            where: {
                userId_date: {
                    userId: session.user.id,
                    date: new Date(date),
                },
            },
            update: {},
            create: {
                user: { connect: { email: session.user.email } },
                date: new Date(date),
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
}
