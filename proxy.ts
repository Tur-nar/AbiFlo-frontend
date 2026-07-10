import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { AuthRoutes, DASHBOARD_ROUTES } from "@/constants/routes";

function redirectTo(pathname: string, request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

export function proxy(request: NextRequest) {
  const sessionToken = getSessionCookie(request);
  const { pathname } = request.nextUrl;
  const isDashboardRoute =
    pathname === DASHBOARD_ROUTES.HOME ||
    pathname.startsWith(`${DASHBOARD_ROUTES.HOME}/`);
  const isProtectedRoute =
    isDashboardRoute || pathname === AuthRoutes.ONBOARDING;

  if (isProtectedRoute && !sessionToken) {
    return redirectTo(AuthRoutes.SIGN_IN, request);
  }

  const isAuthPage =
    pathname === AuthRoutes.SIGN_IN || pathname === AuthRoutes.SIGN_UP;

  if (isAuthPage && sessionToken) {
    return redirectTo(DASHBOARD_ROUTES.HOME, request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding", "/sign-in", "/sign-up"],
};
