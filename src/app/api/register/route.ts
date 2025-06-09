
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

function isSecurePassword(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*[\W\d]).{8,}$/;
    return regex.test(password);
}

export async function POST(req: NextRequest) {
    const { email, password, name, surname } = await req.json();

    if (!email || !password ||! name || !surname) {
        return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    if (!isSecurePassword(password)) {
        return NextResponse.json({
            error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial ou chiffre.",
        }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        return NextResponse.json({ error: "Un utilisateur avec cet email existe déjà" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            name,
            surname,
            hashedPassword,
            role: "STUDENT",
        },
    });

    return NextResponse.json({ success: true, user });
}
