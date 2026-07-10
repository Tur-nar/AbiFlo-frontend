"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Laptop } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
            {theme === "light" && <Sun className="h-4 w-4 text-brand" />}
            {theme === "dark" && <Moon className="h-4 w-4 text-brand" />}
            {theme === "system" && <Laptop className="h-4 w-4 text-brand" />}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="bg-popover border-border min-w-[100px]">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="text-xs flex items-center gap-2 hover:bg-muted py-1.5 cursor-pointer text-popover-foreground"
        >
          <Sun className="h-3.5 w-3.5" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="text-xs flex items-center gap-2 hover:bg-muted py-1.5 cursor-pointer text-popover-foreground"
        >
          <Moon className="h-3.5 w-3.5" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="text-xs flex items-center gap-2 hover:bg-muted py-1.5 cursor-pointer text-popover-foreground"
        >
          <Laptop className="h-3.5 w-3.5" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
