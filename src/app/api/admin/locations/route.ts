import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'


export async function GET() {
    const locations = await prisma.location.findMany({
        select: {
            id: true,
            name: true,
            address: true,
            link: true,
        },
        orderBy: { name: 'asc' },
    })
    return NextResponse.json(locations)
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

    const { name, address, link } = await req.json()

    try {
        const newLocation = await prisma.location.create({
            data: {
                name,
                address,
                link,
                createdById: user.id,
            },
        })

        return NextResponse.json(newLocation)
    } catch (error) {
        console.error("POST /api/locations error", error)
        return NextResponse.json({ error: "Location creation failed" }, { status: 500 })
    }
}
