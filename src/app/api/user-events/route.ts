import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/authOptions'


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
            location: {
                select: {
                    id: true,
                    name: true,
                    address: true,
                    link: true,
                },
            },
            createdBy: { select: { id: true, role: true } },
            participants: true,
            Event: {
                select: {
                    id: true,
                    activity: true,
                },
            },
        },
        orderBy: {
            date: 'asc',
        },
    })
    
    const mappedUserEvents = userEvents.map(event => ({
        ...event,
        name: event.activity,
        locations: [event.location],
        time: new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: event.date.toISOString().split('T')[0],
        availableCount: event.participants.length,
        isUserParticipating: event.participants.some(p => p.id === event.createdBy.id),
    }))
    
    return NextResponse.json(mappedUserEvents)
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
