import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    const data = await req.json()

    try {
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                role: data.role || 'STUDENT',
            },
        })

        return NextResponse.json(user)
    } catch (err) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
}
