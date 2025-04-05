
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../../../auth';

export async function DELETE(
    _: NextRequest,
    { params }: { params: { id: string } }
) {
    await prisma.event.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
}


export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const eventId = params.id;
    const { activity, date, locationIds } = await req.json();

    try {
        await prisma.event.update({
            where: { id: eventId },
            data: {
                locations: { set: [] },
            },
        });
        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: {
                activity,
                date: new Date(date),
                locations: {
                    connect: locationIds.map((id: string) => ({ id })),
                },
            },
            include: {
                locations: true,
            },
        });

        return NextResponse.json(updatedEvent);
    } catch (error) {
        console.error("PATCH /admin/events error", error);
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
    }
}

