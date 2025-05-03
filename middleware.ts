import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken"); // Check if user is authenticated
  const { pathname } = request.nextUrl;

  // Check if path is a protected route (dashboard and its nested routes)
  const isProtectedRoute = pathname === "/home" ||
    pathname === "/profile" ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  // Check if path is an auth route
  const isAuthRoute = pathname === "/signin" || pathname === "/register";

  // 🔒 Redirect unauthenticated users away from protected pages
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 🚫 Prevent authenticated users from accessing signin and register pages
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url)); // Redirect to dashboard
  }

  return NextResponse.next();
}

export const config = {
  // Use more specific patterns to match routes including nested routes
  matcher: [
    '/home',
    '/profile',
    '/dashboard',
    '/dashboard/:path*', // This will match all paths under dashboard
    '/signin',
    '/register'
  ],
};