import NextAuth from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"
import { prisma } from "@/lib/prisma" // your Prisma instance
import { PrismaAdapter } from '@next-auth/prisma-adapter';


export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        MicrosoftEntraID({
            allowDangerousEmailAccountLinking: true,
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
            id: "microsoft-entra-id",
            authorization: {
                params: {
                    prompt: "login",
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user, profile }) {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: user.email! },
            })

            // If not, create them with data from Microsoft
            if (!existingUser) {
                await prisma.user.create({
                    data: {
                        email: user.email!,
                        name: user.name || profile?.name || "Utilisateur",
                        role: "STUDENT", // default role
                    },
                })
            }

            return true
        },
        async session({ session, user }) {
            if (session.user) {
                session.user.role = user.role as "ADMIN" | "STUDENT" | undefined;
            }
            return session
        },
    },
})