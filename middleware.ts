// import { NextResponse } from "next/server";

// export function middleware(request: { [key: string]: any }) {
//   const token = request.cookies.get("authToken"); // Replace this with your actual authentication login

// if (!token) {
//   return NextResponse.redirect(new URL("/signin", request.url));
// }

// return NextResponse.next();
// }

// export const config = { 
// matcher: ["/home", "/dashboard" ],
// };  
import { NextResponse } from "next/server";

export function middleware(request: { [key: string]: any }) {
  const token = request.cookies.get("authToken");
  // ✅ If token exists, continue to the page
  if (token) {
    return NextResponse.next();
  }

  // 🚀 If no token, redirect only if accessing protected routes
  if (["/home", "/dashboard", "/profile"].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/dashboard", "/profile"],
};
