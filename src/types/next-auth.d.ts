import NextAuth from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            name?: string
            email?: string
            role?: "ADMIN" | "STUDENT"
        }
    }

    interface User {
        id: string
        role?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string
    }
}
