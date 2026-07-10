export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-brand">
              <span className="text-[10px] font-bold text-brand-foreground">A</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              AbiFlo
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            <a
              href="#"
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              API Docs
            </a>
            <a
              href="#"
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              System Status
            </a>
          </div>

          {/* Copyright */}
          <p className="text-[10px] text-muted-foreground md:text-right">
            &copy; {currentYear} Abiflo Technical Habit Systems. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
