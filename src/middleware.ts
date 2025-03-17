import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 로그인된 사용자가 접근하면 안 되는 페이지
const authRoutes = ["/login", "/signup"];

// 보호된 라우트 (로그인 필요)
const protectedRoutes = ["/check"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get("cookie");

  // 액세스 토큰과 리프레시 토큰 확인
  const hasAccessToken = cookieHeader?.includes("access-token");
  const hasRefreshToken = cookieHeader?.includes("refresh-token");
  const hasTokens = hasAccessToken || hasRefreshToken;

  const requestHeaders = new Headers(request.headers);

  // 이미 로그인된 사용자의 인증 페이지 접근 제한
  if (authRoutes.includes(pathname) && hasTokens) {
    const redirectUrl = new URL("/check", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 일반 보호된 라우트
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // 토큰이 전혀 없는 경우 로그인 페이지로 리다이렉트
    if (!hasTokens) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }

    // 액세스 토큰이 없고 리프레시 토큰만 있는 경우 토큰 재발급 시도
    if (!hasAccessToken && hasRefreshToken) {
      try {
        // 토큰 재발급 API 호출
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: cookieHeader || "",
            },
            credentials: "include",
          }
        );

        // 토큰 재발급 성공
        if (response.ok) {
          // 새 토큰을 쿠키에 설정
          const setCookieHeader = response.headers.get("set-cookie");

          if (setCookieHeader) {
            // 원래 요청 경로로 리다이렉트하면서 새 쿠키 설정
            const res = NextResponse.redirect(request.url);
            res.headers.set("Set-Cookie", setCookieHeader);
            return res;
          }
          return NextResponse.next();
        }
      } catch (error) {
        // 오류 발생 시 로그인 페이지로 리다이렉트
        const url = new URL("/login", request.url);
        return NextResponse.redirect(url);
      }
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
