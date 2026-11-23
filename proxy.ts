import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(req: NextRequest) {
  const session = await auth();

  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");

  const isAuthRoute =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");

  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";

  // Protect admin routes
  if (isAdminRoute && (!isAuthenticated || !isAdmin)) {
    const signInUrl = new URL("/auth/login", req.url);

    signInUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search);

    return NextResponse.redirect(signInUrl);
  }

  // Prevent authenticated users from accessing auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/login", "/auth/register"],
};
