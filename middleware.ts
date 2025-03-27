import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken"); // Check if user is authenticated
  const { pathname } = request.nextUrl;

  // 🔒 Redirect unauthenticated users away from protected pages
  if (!token && ["/home", "/dashboard", "/profile"].includes(pathname)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 🚫 Prevent authenticated users from accessing signin and register pages
  if (token && ["/signin", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url)); // Redirect to home or dashboard
  } 

  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/dashboard", "/profile", "/signin", "/register"], // Apply middleware to these routes
};


// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("authToken"); // Get the auth token
//   const { pathname } = request.nextUrl;

//   // 🔒 Protected routes for authenticated users
//   const protectedRoutes = ["/home", "/dashboard", "/profile"];
//   const adminRoutes = ["/adminportal"]; // Add your admin-only routes

//   if (!token) {
//     // Redirect unauthenticated users trying to access protected or admin pages
//     if (protectedRoutes.includes(pathname) || adminRoutes.includes(pathname)) {
//       return NextResponse.redirect(new URL("/signin", request.url));
//     }
//   } else {
//     // Decode token to check user role
//     const payload = JSON.parse(atob(token?.value.split(".")[1] || "")); // Decode JWT payload
//     const userRole = payload.role; // Assuming role is stored in token
// console.log(userRole, "userRole");
//     // 🚫 Prevent authenticated users from accessing signin and register pages
//     if (["/signin", "/register"].includes(pathname)) {
//       return NextResponse.redirect(new URL("/", request.url)); // Redirect to home or dashboard
//     }

//     // 🔒 Restrict access to admin-only pages
//     if (adminRoutes.includes(pathname) && userRole !== "admin") {
//       return NextResponse.redirect(new URL("/not-found", request.url)); // Redirect unauthorized users
//     }
//   }

//   return NextResponse.next();
// }
// export const config = {
//   matcher: [
//     "/home",
//     "/dashboard",
//     "/profile",
//     "/signin",
//     "/register",
//     "/adminportal",
//   ], // Add admin route here
// };
