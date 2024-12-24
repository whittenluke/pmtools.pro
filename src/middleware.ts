import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log(`[${new Date().toISOString()}] Middleware start: ${req.nextUrl.pathname}`);
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Refresh session if it exists
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log(`[${new Date().toISOString()}] Session state:`, session ? 'Found' : 'None');

    // Protected routes that require authentication
    const protectedPaths = ['/projects', '/account'];
    const isProtectedPath = protectedPaths.some(path => 
      req.nextUrl.pathname.startsWith(path)
    );

    // Auth pages that should redirect to projects if authenticated
    const authPaths = ['/login', '/signup', '/auth/callback'];
    const isAuthPath = authPaths.some(path => 
      req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(path)
    );

    // If user is authenticated
    if (session) {
      // Redirect from auth pages to projects
      if (isAuthPath) {
        console.log(`[${new Date().toISOString()}] Auth path with session, redirecting to projects`);
        const response = NextResponse.redirect(new URL('/projects', req.url));
        
        // Copy over the session cookies
        const sessionResponse = res.headers.getSetCookie();
        sessionResponse.forEach(cookie => {
          response.headers.append('Set-Cookie', cookie);
        });
        
        return response;
      }
      // Allow access to protected routes
      console.log(`[${new Date().toISOString()}] Protected path with session, allowing`);
      return res;
    }

    // If user is not authenticated
    if (isProtectedPath) {
      console.log(`[${new Date().toISOString()}] Protected path without session, redirecting to login`);
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('next', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    console.log(`[${new Date().toISOString()}] Middleware end: ${req.nextUrl.pathname}`);
    return res;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Middleware error:`, error);
    return res;
  }
}

export const config = {
  matcher: [
    '/projects/:path*',
    '/account/:path*',
    '/login',
    '/signup',
    '/auth/callback',
  ],
};