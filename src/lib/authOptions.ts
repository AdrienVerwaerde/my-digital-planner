
import NextAuth, { getServerSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import { prisma } from './prisma';

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
    interface User {
        role: "ADMIN" | "STUDENT";
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                name: { label: "Name", type: "text" },
                surname: { label: "Surname", type: "text" },
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({ where: { email: credentials?.email } });
                if (!user || !credentials?.password) return null;
                const isValid = await bcrypt.compare(credentials.password, user.hashedPassword ?? '');
                if (!isValid) return null;
                return user;
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
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.name = user.name;
                token.surname = user.surname;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as "ADMIN" | "STUDENT";
                session.user.name = token.name as string;
                session.user.surname = token.surname as string;
                session.user.email = token.email as string;
            }
            return session;
        },

        async signIn({ user, profile }) {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: user.email! },
            })
            // If not, create a new user
            if (!existingUser) {
                const [name, surname] = (user.name || profile?.name || "Utilisateur").split(" ");
                await prisma.user.create({
                    data: {
                        email: user.email!,
                        name: name || "Utilisateur",
                        surname: surname || "",
                        role: "STUDENT",
                    },
                });
            }
            return true
        }
    }
};

export const auth = () => getServerSession(authOptions);

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

