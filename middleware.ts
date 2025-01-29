import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth data from cookies
  const authData = request.cookies.get("auth-storage")?.value;

  let isAuthenticated = false;
  let userRole: string | null = null;
  let token: string | null = null;

  if (authData) {
    try {
      const parsedData = JSON.parse(decodeURIComponent(authData));
      // Access the nested state object
      isAuthenticated = parsedData.state?.isAuthenticated || false;
      userRole = parsedData.state?.user?.role || null;
      token = parsedData.state?.token || null;
    } catch (error) {
      console.error("Error parsing auth data:", error);
    }
  }

  // If authenticated, redirect from login page to respective dashboards
  if (isAuthenticated && token) {
    if (pathname === "/login") {
      return NextResponse.redirect(
        new URL(userRole === "admin" ? "/admin" : "/pos", request.url)
      );
    }
  }

  // Public paths that don't require authentication
  const publicPaths = ["/login"];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if user is trying to access admin routes
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated || !token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Check if user is trying to access POS routes
  if (pathname.startsWith("/pos")) {
    if (!isAuthenticated || !token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (userRole !== "pos") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Clone the headers
  const requestHeaders = new Headers(request.headers);

  // If authenticated, add the token to API requests
  if (isAuthenticated && token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  // Return the response with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/pos/:path*", "/login"],
};
