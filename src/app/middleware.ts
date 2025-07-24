// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/signin', '/register', '/public']; // 不需要登录的路径

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 静态资源 /api 请求不拦截
  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 白名单路径不拦截
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 获取 cookie 中的 token
  const token = request.cookies.get('token')?.value;

  if (!token) {
    const loginUrl = new URL('/signin', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
