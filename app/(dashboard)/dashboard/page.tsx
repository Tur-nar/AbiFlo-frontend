"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserProfile } from "@/hooks/use-user";


export default function DashboardPage() {
  const { data: profile, isLoading, error } = useGetUserProfile();


  if (isLoading) {
    return (
      <div className="space-y-4 max-w-xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive font-medium">
        Error loading profile: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          System Overview
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor your core architecture and metrics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border bg-card/45 backdrop-blur-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              XP Level
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              Level {profile?.level}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Total XP earned: {profile?.totalXp} XP
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/45 backdrop-blur-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Tier Status
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              {profile?.isPro ? "Pro Plan" : "Free Plan"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Scale limits active
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/45 backdrop-blur-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Onboarding
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              {profile?.onboardingCompletedAt ? "Completed" : "Pending"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground font-mono">
              TZ: {profile?.timezone}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card/45 backdrop-blur-xs p-6">
        <h3 className="text-sm font-semibold text-foreground mb-2">Welcome to your dashboard</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Phase 1 setup has successfully connected the Next.js client with the NestJS backend and Better Auth. Your user profile, settings, and subscription states are now managed dynamically. Let&apos;s build out your habits in the next phase!
        </p>
      </Card>
    </div>
  );
}
