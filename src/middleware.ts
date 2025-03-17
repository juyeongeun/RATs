import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 로그인된 사용자가 접근하면 안 되는 페이지
const authRoutes = ["/login", "/signup"];

// 보호된 라우트 (로그인 필요)
const protectedRoutes = ["/check"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get("cookie");
  const hasTokens =
    cookieHeader?.includes("access-token") &&
    cookieHeader?.includes("refresh-token");

  const requestHeaders = new Headers(request.headers);

  // 이미 로그인된 사용자의 인증 페이지 접근 제한
  if (authRoutes.includes(pathname) && hasTokens) {
    const redirectUrl = new URL("/check", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 일반 보호된 라우트
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!hasTokens) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
