
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../../auth";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    await prisma.event.delete({ where: { id: (await params).id } });
    return NextResponse.json({ success: true });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { activity, locationIds } = await req.json();

    try {
        // Clear existing locations
        await prisma.event.update({
            where: { id: (await params).id },
            data: {
                locations: { set: [] },
            },
        });

        // Update activity and new locations
        const updatedEvent = await prisma.event.update({
            where: { id: (await params).id },
            data: {
                activity,
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
