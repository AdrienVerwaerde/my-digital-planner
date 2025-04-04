import { NextResponse } from "next/server"
import { auth } from "../../../../../auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    const session = await auth()

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, address } = await req.json()

    if (!name || typeof name !== 'string' || !address || typeof address !== 'string') {
        return NextResponse.json({ error: "Missing or invalid name/address" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    })

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    try {
        const newLocation = await prisma.location.create({
            data: {
                name,
                address,
                createdById: user.id,
            },
        })

        return NextResponse.json({ success: true, location: newLocation })
    } catch (error) {
        console.error("Location creation error:", error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
