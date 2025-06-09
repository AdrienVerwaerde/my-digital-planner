import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ activity: string }> }) {
    const { activity } = await params;
    
    const event = await prisma.event.findFirst({
        where: { activity },
        include: { locations: true }
    });
    
    if (!event) return NextResponse.json({ locations: [] });
    
    return NextResponse.json({ locations: event.locations });
}