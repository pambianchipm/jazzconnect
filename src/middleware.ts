import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If user is authenticated but not onboarded, redirect to onboarding
    // (unless already on onboarding or API routes)
    if (
      token &&
      !(token as any).onboarded &&
      !pathname.startsWith("/onboarding") &&
      !pathname.startsWith("/api/") &&
      !pathname.startsWith("/auth/")
    ) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Venue-only routes
    if (pathname.startsWith("/gigs/new") && (token as any)?.role !== "venue") {
      return NextResponse.redirect(new URL("/gigs", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Public routes
        if (
          pathname === "/" ||
          pathname.startsWith("/auth/") ||
          pathname.startsWith("/musicians") ||
          pathname.startsWith("/venues") ||
          pathname.startsWith("/gigs") && !pathname.startsWith("/gigs/new") ||
          pathname.startsWith("/api/auth")
        ) {
          return true;
        }
        // Everything else requires auth
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
