import { NextResponse } from "next/server"
import { auth } from "../../../../../auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    const session = await auth()

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { activity, date, locationId } = await req.json()

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    })

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    try {
        const newEvent = await prisma.event.create({
            data: {
                activity,
                date: new Date(date),
                locations: { connect: { id: locationId } },
                createdById: user.id,
                participants: { connect: { id: user.id } },
            },
        })

        return NextResponse.json({ success: true, event: newEvent })
    } catch (err) {
        console.error("Create event error", err)
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
    }
}
