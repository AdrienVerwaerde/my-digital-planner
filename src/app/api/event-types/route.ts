import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";


export async function GET() {
    const session = await auth()

    const isAdmin = session?.user?.role === 'ADMIN'

    const types = await prisma.event.findMany({
        where: isAdmin ? {} : { proposable: true },
        distinct: ["activity"],
        select: {
            activity: true,
            type: true,
        },
    })

    return NextResponse.json(types);
}
