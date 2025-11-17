import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const REFRESH_COOKIE_NAME = "jid";

const PUBLIC_PATHS = ["/auth/login", "/auth/register"];

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const pathname = url.pathname;

    const refreshToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;
    const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

    if (isPublic) {
        if (refreshToken) {
            url.pathname = "/tasks";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    if (pathname === "/") {
        url.pathname = refreshToken ? "/tasks" : "/auth/login";
        return NextResponse.redirect(url);
    }

    if (!refreshToken) {
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}
