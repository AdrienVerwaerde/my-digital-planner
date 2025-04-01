import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '../../../../auth'

export async function POST(req: Request) {
    const session = await auth()

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { date, isAvailable } = await req.json()

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const userId = user.id
        const availabilityDate = new Date(date)

        if (isAvailable) {
            // CREATE or UPSERT availability
            await prisma.availability.upsert({
                where: {
                    userId_date: {
                        userId,
                        date: availabilityDate,
                    },
                },
                update: {},
                create: {
                    user: { connect: { id: userId } },
                    date: availabilityDate,
                },
            })
        } else {
            // DELETE availability
            await prisma.availability.deleteMany({
                where: {
                    userId,
                    date: availabilityDate,
                },
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
}
