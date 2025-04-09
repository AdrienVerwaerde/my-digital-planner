import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const linkedEvents = await prisma.userEvent.findMany({
        where: { locationId: (await params).id },
        select: { id: true },
    });

    if (linkedEvents.length > 0) {
        return NextResponse.json({
            error: "Ce lieu est utilisé dans un ou plusieurs événements.",
        }, { status: 400 });
    }

    await prisma.location.delete({ where: { id: (await params).id } });
    return NextResponse.json({ success: true });
}


export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const body = await req.json()
    const { name, address, link } = body

    try {
        const updated = await prisma.location.update({
            where: { id: (await params).id },
            data: { name, address, link },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("PATCH /api/locations/[id] error", error)
        return NextResponse.json({ error: "Failed to update location" }, { status: 500 })
    }
}
