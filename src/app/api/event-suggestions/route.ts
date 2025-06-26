import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/authOptions'

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

export async function GET() {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const suggestions = await prisma.eventSuggestion.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        const formattedSuggestions = suggestions.map(suggestion => ({
            id: suggestion.id,
            name: suggestion.name,
            location: suggestion.location,
            hour: suggestion.hour.toISOString(),
            message: suggestion.message || '',
            userName: suggestion.userName,
            userSurname: suggestion.userSurname
        }))

        return NextResponse.json(formattedSuggestions)
    } catch (error) {
        console.error('Failed to fetch suggestions:', error)
        return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 })
    }
}