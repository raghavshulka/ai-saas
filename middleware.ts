import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Allow access to the home page, authentication routes, and login page without checking authentication
  if (
    req.nextUrl.pathname === '/' || 
    req.nextUrl.pathname.startsWith('/api/auth') || 
    req.nextUrl.pathname === '/signin'
  ) {
    return NextResponse.next();
  }

  // Get the session token using NextAuth's JWT
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token exists, redirect to the login page with a callback URL
  if (!token) {
    const loginUrl = new URL('/signin', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url);  // Set callback to the current URL
    return NextResponse.redirect(loginUrl);  // Redirect to login
  }

  // Allow the request to proceed if the user is authenticated
  return NextResponse.next();
}

// Define the matcher to apply middleware to all routes except static files
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],  // Ignore static assets
};
