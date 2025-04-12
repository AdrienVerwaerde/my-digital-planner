
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../auth";

export async function GET() {
    const events = await prisma.event.findMany({
        include: {
            locations: { select: { id: true, name: true } },
        },
        orderBy: { activity: 'asc' },
    });
    return NextResponse.json(events);
}

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { activity, locationIds, type, proposable } = await req.json();

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
        const event = await prisma.event.create({
            data: {
                activity,
                type,
                proposable,
                createdById: user.id,
                locations: {
                    connect: locationIds.map((id: string) => ({ id })),
                },
            },
        });


        return NextResponse.json(event);
    } catch (error) {
        console.error("POST /admin/events error", error);
        return NextResponse.json({ error: "Event creation failed" }, { status: 500 });
    }
}