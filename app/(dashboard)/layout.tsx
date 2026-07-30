"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { AuthRoutes } from "@/constants/routes";
import { useGetUserProfile } from "@/hooks/use-user";
import { AbiFloLoader } from "@/components/common/AbiFloLoader";
import { AppSidebar, NAV_ITEMS } from "@/components/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

/**
 * Derives breadcrumb segments from the current pathname.
 * e.g. /dashboard/habits → [{ label: "Dashboard", href: "/dashboard" }, { label: "Habits" }]
 */
function useBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;

    const navMatch = NAV_ITEMS.find((item) => item.href === href);
    const label = navMatch
      ? navMatch.label
      : segment.charAt(0).toUpperCase() + segment.slice(1);

    return { label, href, isLast };
  });
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [sessionCheckTimedOut, setSessionCheckTimedOut] = useState(false);
  const hasSession = Boolean(session);
  const { data: profile, isLoading: profileLoading } = useGetUserProfile(hasSession);
  const shouldRedirectToSignIn = (!sessionPending && !session) || (sessionCheckTimedOut && !session);
  const needsOnboarding = Boolean(
    session && !profileLoading && profile && !profile.onboardingCompletedAt
  );
  const breadcrumbs = useBreadcrumbs(pathname);

  useEffect(() => {
    if (!sessionPending || session) return;

    const timeout = window.setTimeout(() => {
      setSessionCheckTimedOut(true);
    }, 1500);

    return () => window.clearTimeout(timeout);
  }, [session, sessionPending]);

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
  }, [
    profile,
    profileLoading,
    session,
    sessionPending,
    shouldRedirectToSignIn,
    router,
  ]);

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

  if (
    (sessionPending && !sessionCheckTimedOut) ||
    !session ||
    profileLoading ||
    needsOnboarding
  ) {
    return <AbiFloLoader />;
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar
          user={session.user}
          avatarUrl={profile?.avatarUrl}
          onLogout={handleLogout}
        />

        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/60 px-6">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <BreadcrumbItem key={crumb.href}>
                    {index > 0 && <BreadcrumbSeparator />}
                    {crumb.isLast ? (
                      <BreadcrumbPage className="text-xs">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        render={<Link href={crumb.href} />}
                        className="text-xs"
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex-1 p-6 w-full">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
