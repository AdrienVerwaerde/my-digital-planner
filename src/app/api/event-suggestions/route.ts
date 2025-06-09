import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, location, hour, message } = await req.json()

    if (!name || !location || !hour) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    try {
        await prisma.eventSuggestion.create({
            data: {
                name,
                location,
                hour: new Date(hour),
                message,
                userName: session.user.name,
                userSurname: session.user.surname ?? '',
            },
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Event suggestion error:', error)
        return NextResponse.json({ error: 'Failed to save suggestion' }, { status: 500 })
    }
}
