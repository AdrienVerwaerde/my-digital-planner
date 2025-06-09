import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import { prisma } from './lib/prisma';

// Module augmentation pour étendre les types NextAuth
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "ADMIN" | "STUDENT";
            email: string;
            name: string;
            surname?: string | null;
        };
    }
}

declare module "@auth/core/types" {
    interface User {
        role: "ADMIN" | "STUDENT";
        surname?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: "ADMIN" | "STUDENT";
        surname?: string | null;
        name: string;
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                name: { label: "Name", type: "text" },
                surname: { label: "Surname", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                });

                if (!user || !user.hashedPassword) {
                    return null;
                }

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.hashedPassword
                );

                if (!isValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    surname: user.surname,
                    role: user.role,
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/',
        error: '/login',
    },
    callbacks: {
        async jwt({ token, user, trigger }) {
            // First login - user object is available
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.surname = user.surname;
            }
            // On subsequent requests, refresh user data if needed
            else if (trigger === "update" || !token.surname) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email as string },
                    select: { id: true, role: true, name: true, surname: true, email: true }
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.name = dbUser.name;
                    token.surname = dbUser.surname;
                    token.email = dbUser.email;
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.name = token.name as string;
                session.user.surname = token.surname;
                session.user.email = token.email as string;
            }
            return session;
        },

        async signIn({ user, profile, account }) {
            try {
                // Pour Google OAuth, vérifier si l'utilisateur existe
                if (account?.provider === "google" && user.email) {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email },
                    });

                    // Si l'utilisateur n'existe pas, le créer
                    if (!existingUser) {
                        const displayName = user.name || profile?.name || "Utilisateur";
                        const [firstName, ...lastNameParts] = displayName.split(" ");
                        const lastName = lastNameParts.join(" ");

                        const newUser = await prisma.user.create({
                            data: {
                                email: user.email,
                                name: lastName || "Nom",
                                surname: firstName || "Prénom",
                                role: "STUDENT",
                            },
                        });

                        // Mettre à jour l'objet user avec les données de la DB
                        user.id = newUser.id;
                        user.role = newUser.role;
                        user.name = newUser.name;
                        user.surname = newUser.surname;
                    } else {
                        // Utilisateur existant, mettre à jour l'objet user
                        user.id = existingUser.id;
                        user.role = existingUser.role;
                        user.name = existingUser.name;
                        user.surname = existingUser.surname;
                    }
                }
                return true;
            } catch (error) {
                console.error("Erreur lors de la connexion:", error);
                return false;
            }
        }
    }
});