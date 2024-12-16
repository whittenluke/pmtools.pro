import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  const { data: { session }, error } = await supabase.auth.getSession();

  // Handle auth routes when already logged in
  if (['/login', '/signup'].includes(req.nextUrl.pathname) && session) {
    const redirectUrl = req.nextUrl.searchParams.get('redirect') || '/projects';
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // Protected routes
  if (req.nextUrl.pathname.startsWith('/projects') || 
      req.nextUrl.pathname.startsWith('/account')) {
    if (!session) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Auth callback handling
  if (req.nextUrl.pathname === '/auth/callback') {
    const code = req.nextUrl.searchParams.get('code');
    if (!code) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return res;
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