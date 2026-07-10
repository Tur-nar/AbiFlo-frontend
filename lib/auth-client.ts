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
