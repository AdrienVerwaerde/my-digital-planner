import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    const body = await req.json()

    const { date, activity, location, createdById } = body

    if (!date || !activity || !location || !createdById) {
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
        )
    }

    try {
        const event = await prisma.event.create({
            data: {
                date: new Date(date),
                activity,
                location,
                createdBy: {
                    connect: {
                        id: createdById,
                    },
                },
            },
        })

        return NextResponse.json(event)
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Event creation failed' }, { status: 500 })
    }
}
