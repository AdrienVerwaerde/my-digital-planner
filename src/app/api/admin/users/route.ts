// src/app/api/admin/users/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
}

export async function POST(req: Request) {
    const { name, email, role } = await req.json()
    const newUser = await prisma.user.create({
        data: { name, email, role }
    })
    return NextResponse.json(newUser)
}