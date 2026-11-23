import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(req: NextRequest) {
  const session = await auth();

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!session?.user || session.user.role !== "ADMIN") {
      const signInUrl = new URL("/auth/login", req.url);

      signInUrl.searchParams.set(
        "callbackUrl",
        req.nextUrl.pathname + req.nextUrl.search,
      );

      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
