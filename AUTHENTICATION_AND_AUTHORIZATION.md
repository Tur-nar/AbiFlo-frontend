# Habit Tracker Authentication and Authorization Documentation

This document describes the exact implementation of **Authentication**, **Session Management**, **Onboarding Authorization Guards**, and **Route Middleware** in the `Habit-Tracker` codebase.

---

## 1. Architecture Overview

```mermaid
graph TD
    A[Next.js Middleware / proxy.ts] -->|getSessionCookie| B{Active Session Token?}
    B -->|No Token & Protected Route| C[Redirect to /sign-in]
    B -->|Has Token & Auth Route| D[Redirect to /dashboard]
    B -->|Pass| E[App Routes]

    E --> F[Auth Pages<br>sign-in/page.tsx, sign-up/page.tsx]
    F -->|Email / Google OAuth| G[Better Auth Client SDK<br>lib/auth-client.ts]
    
    E --> H[Dashboard Layout<br>app/(dashboard)/layout.tsx]
    H -->|authClient.useSession| I[Better Auth Session]
    H -->|useGetUserProfile| J[Backend API /users/me<br>Axios withCredentials]
    J -->|check onboardingCompletedAt| K{Onboarding Completed?}
    K -->|No| L[Redirect to /onboarding]
    K -->|Yes| M[Render Dashboard]
```

---

## 2. Directory Structure

```text
frontend/
├── lib/
│   ├── auth-client.ts          # Better Auth React Client instance & Session type
│   └── api/
│       ├── client.ts           # Axios instance with withCredentials & response interceptor
│       └── users.api.ts        # User profile, settings & onboarding API endpoints
├── proxy.ts                    # Next.js Middleware / Route guard (Session cookie check)
├── constants/
│   └── routes.ts               # Auth & Dashboard route definitions
├── hooks/
│   └── use-user.ts             # TanStack React Query hooks for user profile & onboarding
├── app/
│   ├── (auth)/
│   │   ├── sign-in/page.tsx    # Email & Google Sign In page
│   │   ├── sign-up/page.tsx    # Email & Google Sign Up page
│   │   └── onboarding/page.tsx # User onboarding page
│   └── (dashboard)/
│       └── layout.tsx          # Protected Dashboard Layout with Session & Onboarding guards
```

---

## 3. Required Dependencies (`package.json`)

```json
{
  "dependencies": {
    "better-auth": "^1.2.6",
    "@tanstack/react-query": "^5.66.0",
    "axios": "^1.8.1",
    "next": "16.1.6",
    "react": "19.0.0",
    "sonner": "^2.0.1",
    "lucide-react": "^0.475.0"
  }
}
```

---

## 4. Codebase Implementation Breakdown

### 1. Better Auth Client SDK (`frontend/lib/auth-client.ts`)

Configures `better-auth/react` client with custom API URL parsing.

```typescript
import { createAuthClient } from "better-auth/react";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const authBaseUrl = apiBaseUrl.endsWith("/api")
  ? apiBaseUrl.slice(0, -"/api".length)
  : apiBaseUrl;

export const authClient = createAuthClient({
  baseURL: authBaseUrl,
  basePath: "/api/auth",
});

export type Session = typeof authClient.$Infer.Session;
```

---

### 2. Middleware & Server-Side Route Guard (`frontend/proxy.ts`)

Checks `getSessionCookie(request)` from `better-auth/cookies` for route protection prior to page rendering.

```typescript
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
```

---

### 3. Axios Client Integration (`frontend/lib/api/client.ts`)

Axios configured to send `httpOnly` session cookies via `withCredentials: true` and intercept errors.

```typescript
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error?.message || "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);
```

---

### 4. Route Constants (`frontend/constants/routes.ts`)

Centralized definitions for authentication and dashboard routes.

```typescript
export const AuthRoutes = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  ONBOARDING: "/onboarding",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_EMAIL: "/verify-email",
};

export const DASHBOARD_ROUTES = {
  HOME: "/dashboard",
  HABITS: "/dashboard/habits",
  HABITS_ARCHIVED: "/dashboard/habits/archived",
  HABIT_DETAIL: (id: string) => `/dashboard/habits/${id}` as const,
  GOALS: "/dashboard/goals",
  SETTINGS: "/dashboard/settings",
};
```

---

### 5. User Profile API & Query Hooks (`frontend/lib/api/users.api.ts` & `frontend/hooks/use-user.ts`)

Fetches user profile data to verify onboarding status.

```typescript
// frontend/lib/api/users.api.ts
import { api } from "./client";
import { UserProfile, CompleteOnboardingPayload } from "@/types/user.types";
import { ApiResponse } from "@/types/api.types";

export const GetUserProfileApi = async (): Promise<UserProfile> => {
  const res = await api.get<any, ApiResponse<UserProfile>>("/users/me");
  return res.data;
};

// frontend/hooks/use-user.ts
import { useQuery } from "@tanstack/react-query";
import { GetUserProfileApi } from "@/lib/api/users.api";
import { userKeys } from "@/constants/query-key";

export const useGetUserProfile = (enabled = true) => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: GetUserProfileApi,
    enabled,
  });
};
```

---

### 6. Sign In Page (`frontend/app/(auth)/sign-in/page.tsx`)

Handles Email/Password sign in and Google Social OAuth using `authClient`.

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { AuthRoutes, DASHBOARD_ROUTES } from "@/constants/routes";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Failed to sign in");
      } else {
        toast.success("Signed in successfully!");
        router.push(DASHBOARD_ROUTES.HOME);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: DASHBOARD_ROUTES.HOME,
      });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Email, Password inputs & Google Social Login button */}
    </form>
  );
}
```

---

### 7. Sign Up Page (`frontend/app/(auth)/sign-up/page.tsx`)

Handles user registration and redirects to `/onboarding`.

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (password !== confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  setLoading(true);
  try {
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (error) {
      toast.error(error.message || "Failed to sign up");
    } else {
      toast.success("Account created successfully!");
      router.push(AuthRoutes.ONBOARDING);
    }
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
  } finally {
    setLoading(false);
  }
};
```

---

### 8. Protected Dashboard Layout & Onboarding Authorization (`frontend/app/(dashboard)/layout.tsx`)

Combines `authClient.useSession()` and `useGetUserProfile()` to guard the dashboard, check for onboarding completion, and manage sign out.

```typescript
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { AuthRoutes } from "@/constants/routes";
import { useGetUserProfile } from "@/hooks/use-user";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [sessionCheckTimedOut, setSessionCheckTimedOut] = useState(false);
  const hasSession = Boolean(session);
  const { data: profile, isLoading: profileLoading } = useGetUserProfile(hasSession);

  const shouldRedirectToSignIn = (!sessionPending && !session) || (sessionCheckTimedOut && !session);
  const needsOnboarding = Boolean(
    session && !profileLoading && profile && !profile.onboardingCompletedAt
  );

  // Fallback timeout for session check
  useEffect(() => {
    if (!sessionPending || session) return;
    const timeout = window.setTimeout(() => {
      setSessionCheckTimedOut(true);
    }, 1500);
    return () => window.clearTimeout(timeout);
  }, [session, sessionPending]);

  // Auth & Onboarding Guard logic
  useEffect(() => {
    if (shouldRedirectToSignIn) {
      router.replace(AuthRoutes.SIGN_IN);
      return;
    }

    if (sessionPending || !session) return;
    if (profileLoading) return;

    if (profile && !profile.onboardingCompletedAt) {
      router.replace(AuthRoutes.ONBOARDING);
    }
  }, [profile, profileLoading, session, sessionPending, shouldRedirectToSignIn, router]);

  // Sign out handler
  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace(AuthRoutes.SIGN_IN);
          },
        },
      });
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  if (sessionPending || !session || profileLoading || needsOnboarding) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {/* App Sidebar & Dashboard Content */}
      {children}
    </div>
  );
}
```

---

## 5. Summary Checklist to Implement in Another Project

1. **Client Setup**: Create `lib/auth-client.ts` with `createAuthClient` from `better-auth/react`.
2. **Middleware Proxy**: Create `proxy.ts` using `getSessionCookie(request)` from `better-auth/cookies` to check auth token on edge requests.
3. **HTTP Client**: Create Axios client (`lib/api/client.ts`) configured with `withCredentials: true`.
4. **Auth Forms**: Use `authClient.signIn.email()`, `authClient.signUp.email()`, and `authClient.signIn.social({ provider: "google" })`.
5. **Dashboard Guard**: Use `authClient.useSession()` + `useGetUserProfile()` in `app/(dashboard)/layout.tsx` to check session validity and onboarding status (`onboardingCompletedAt`).
6. **Sign Out**: Invoke `authClient.signOut({ fetchOptions: { onSuccess: () => router.replace(AuthRoutes.SIGN_IN) } })`.
