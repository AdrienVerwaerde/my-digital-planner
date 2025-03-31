
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "../../../../../auth"

export async function POST(req: Request) {
    const session = await auth()
    const { eventId, isParticipating } = await req.json()

    if (!session?.user?.email || !eventId) {
        return NextResponse.json({ error: "Unauthorized or invalid request" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await prisma.event.update({
        where: { id: eventId },
        data: {
            participants: isParticipating
                ? { connect: { id: user.id } }
                : { disconnect: { id: user.id } },
        },
    })

    return NextResponse.json({ success: true })
}
