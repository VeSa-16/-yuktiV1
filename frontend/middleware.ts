import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
  try {
    const intlMiddleware = createMiddleware({
      locales: ['en', 'hi'],
      defaultLocale: 'en',
      localePrefix: 'as-needed'
    });
    return intlMiddleware(req);
  } catch (err: any) {
    return new NextResponse(`YuktiFi Middleware Crash: ${err.message}\n${err.stack}`, { status: 500 });
  }
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
