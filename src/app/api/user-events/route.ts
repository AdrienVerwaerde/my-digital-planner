import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '../../../../auth'


export async function GET() {
    const session = await auth()

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    })

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userEvents = await prisma.userEvent.findMany({
        include: {
            location: true,
            participants: true,
        },
        orderBy: {
            date: 'asc',
        },
    })

    const mapped = userEvents.map(event => ({
        id: event.id,
        name: event.activity,
        locations: [{ id: event.location.id, name: event.location.name }],
        time: event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: event.date.toISOString().split('T')[0],
        availableCount: event.participants.length,
        isUserParticipating: event.participants.some(p => p.id === user.id),
    }))

    return NextResponse.json(mapped)
}


export async function POST(req: Request) {
    const session = await auth()

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    })

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await req.json()
    const { activity, date, locationId, eventTypeId } = body

    if (!activity || !date || !locationId) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    try {
        const event = await prisma.userEvent.create({
            data: {
                activity,
                date: new Date(date),
                eventId: eventTypeId,
                location: { connect: { id: locationId } },
                createdBy: { connect: { id: user.id } },
                participants: {
                    connect: [{ id: user.id }],
                },
            },
            include: {
                location: true,
                participants: true,
            },
        })

        return NextResponse.json(event)
    } catch (error) {
        console.error('POST /api/user-events error', error)
        return NextResponse.json({ error: "Event creation failed" }, { status: 500 })
    }
}
