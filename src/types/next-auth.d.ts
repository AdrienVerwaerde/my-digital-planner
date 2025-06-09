/* eslint-disable @typescript-eslint/no-unused-vars */

import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            email: string
            name?: string | null
            surname?: string | null
            role: "ADMIN" | "STUDENT"
            image?: string | null
        }
    }

    interface User {
        id: string
        email: string
        name?: string | null
        surname?: string | null
        role: "ADMIN" | "STUDENT"
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: "ADMIN" | "STUDENT"
        surname?: string | null
    }
}

declare module "next-auth/adapters" {
    interface AdapterUser {
        id: string
        email: string
        name?: string | null
        surname?: string | null
        role: "ADMIN" | "STUDENT"
    }
}