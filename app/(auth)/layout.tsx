export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 selection:bg-brand/35 selection:text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.15_0.02_18/0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
