import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken"); // Check if user is authenticated
  const { pathname } = request.nextUrl;

  // 🔒 Redirect unauthenticated users away from protected pages
  if (!token && ["/home","/profile"].includes(pathname)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  //  if (!token && ["/home", "/dashboard", "/profile"].includes(pathname)) {
  //    return NextResponse.redirect(new URL("/signin", request.url));
  //  }

  // 🚫 Prevent authenticated users from accessing signin and register pages
  if (token && ["/signin", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url)); // Redirect to home or dashboard
  } 

  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/dashboard", "/profile", "/signin", "/register"], // Apply middleware to these routes
};


