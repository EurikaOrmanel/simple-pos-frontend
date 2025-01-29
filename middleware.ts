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

  // If authenticated, redirect from login pages to respective dashboards
  if (isAuthenticated && token) {
    if (pathname === "/admin/login" && userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (pathname === "/pos/login" && userRole === "pos") {
      return NextResponse.redirect(new URL("/pos", request.url));
    }
  }

  // Public paths that don't require authentication
  const publicPaths = ["/admin/login", "/pos/login"];
  if (publicPaths.includes(pathname)) {
    console.log("allowed path");
    return NextResponse.next();
  }

  // Check if user is trying to access admin routes
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated || !token) {
      console.log("redirecting to login");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (userRole !== "admin") {
      console.log("redirecting to login");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Check if user is trying to access POS routes
  if (pathname.startsWith("/pos")) {
    if (!isAuthenticated || !token) {
      console.log("redirecting to login");
      return NextResponse.redirect(new URL("/pos/login", request.url));
    }
    if (userRole !== "pos") {
      console.log("redirecting to login");
      return NextResponse.redirect(new URL("/pos/login", request.url));
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
  matcher: ["/admin/:path*", "/pos/:path*"],
};
