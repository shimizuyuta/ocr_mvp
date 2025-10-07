import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const USER = process.env.BASIC_AUTH_USER || '';
const PASS = process.env.BASIC_AUTH_PASS || '';

function basicAuthHeader(user: string, pass: string) {
  // Edge環境では btoa が使える
  return 'Basic ' + btoa(`${user}:${pass}`);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 静的ファイルやfaviconは認証スキップ
  if (pathname.startsWith('/_next/') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  const auth = req.headers.get('authorization');
  const expected = basicAuthHeader(USER, PASS);

  if (auth !== expected) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/|favicon\\.ico).*)'],
};
