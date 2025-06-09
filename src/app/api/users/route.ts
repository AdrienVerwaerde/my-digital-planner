import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt';


export async function POST(req: NextRequest) {
    const data = await req.json();

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                surname: data.surname,
                email: data.email,
                role: data.role || 'STUDENT',
                hashedPassword: hashedPassword,
                accounts: {
                    create: {
                        type: "credentials",
                        provider: "credentials",
                        providerAccountId: data.email,
                    },
                },
            },
        });

        return NextResponse.json(user);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
