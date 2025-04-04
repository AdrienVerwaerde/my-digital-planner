
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const types = await prisma.event.findMany({
        distinct: ["activity"],
        select: { activity: true },
    });

    const uniqueActivities = types.map((e) => e.activity);
    return NextResponse.json(uniqueActivities);
}
