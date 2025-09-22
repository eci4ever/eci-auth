// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Public routes
  if (pathname.startsWith("/auth") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check auth untuk protected routes
  if (!req.auth) {
    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
