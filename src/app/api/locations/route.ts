
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const locations = await prisma.location.findMany({
        select: { id: true, name: true, address: true },
        orderBy: { address: 'asc' },
    });

    return NextResponse.json(locations);
}
