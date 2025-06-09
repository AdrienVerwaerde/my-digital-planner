import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const authPageRoutes = ["/login"];
const apiAuthPrefix = "/api/auth";

export default async function auth(req: any, res: any) {

    const { nextUrl } = req;
    const authData = await req.auth;
    const isLoggedIn = !!req.auth;

    const path = nextUrl.pathname;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isProtectedRoute = protectedRoutes.includes(path);
    const isAuthPageRoute = authPageRoutes.includes(path);

    console.log({ authData });

    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (isLoggedIn && isAuthPageRoute) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    return NextResponse.next();
};


export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
