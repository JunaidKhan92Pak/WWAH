import { NextResponse } from "next/server";

export function middleware(request: { [key: string]: any }) {
  const token = request.cookies.get("authToken"); // Replace this with your actual authentication login
   
if (!token) {
  return NextResponse.redirect(new URL("/signin", request.url));
}

return NextResponse.next();
}

export const config = { 
matcher: ["/home" ],
};  
