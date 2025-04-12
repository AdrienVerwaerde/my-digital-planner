import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { activity: string } }) {
    const event = await prisma.event.findFirst({
        where: { activity: params.activity },
        include: { locations: true }
    })

    if (!event) return NextResponse.json({ locations: [] })

    return NextResponse.json({ locations: event.locations })
}
