import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "../../../../auth"

export async function GET(req: Request) {
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

    const events = await prisma.event.findMany({
        include: {
            participants: true,
        },
    })

    const mapped = events.map(event => ({
        id: event.id,
        name: event.activity,
        location: event.location,
        time: event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: event.date.toISOString().split('T')[0],
        availableCount: event.participants.length,
        isUserParticipating: event.participants.some(p => p.id === user.id),
    }))

    return NextResponse.json(mapped)
}
