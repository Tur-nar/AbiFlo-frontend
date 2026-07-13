import {
  HeartPulse,
  Brain,
  BookOpen,
  Apple,
  Users,
  Wallet,
  Palette,
  Zap,
  Dumbbell,
  Bed,
  Leaf,
  Music,
  Camera,
  Code,
  Globe,
  Trophy,
  Target,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Maps lucide icon names (kebab-case as stored in DB) to their React components.
 * Extend this map when new categories are added.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  "heart-pulse": HeartPulse,
  brain: Brain,
  "book-open": BookOpen,
  apple: Apple,
  users: Users,
  wallet: Wallet,
  palette: Palette,
  zap: Zap,
  dumbbell: Dumbbell,
  bed: Bed,
  leaf: Leaf,
  music: Music,
  camera: Camera,
  code: Code,
  globe: Globe,
  trophy: Trophy,
  target: Target,
  sparkles: Sparkles,
};

interface CategoryIconProps {
  /** The lucide icon name stored in the database (e.g. "heart-pulse") */
  name: string;
  className?: string;
  /** Optionally color the icon with the category's hex */
  colorHex?: string;
}

export function CategoryIcon({ name, className, colorHex }: CategoryIconProps) {
  const Icon = ICON_MAP[name];

  if (!Icon) {
    // Fallback: render the first letter or emoji if it's not a lucide name
    return (
      <span
        className={cn("inline-flex items-center justify-center text-sm", className)}
        style={colorHex ? { color: colorHex } : undefined}
      >
        {name.length <= 2 ? name : name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <Icon
      className={cn("h-4 w-4 shrink-0", className)}
      style={colorHex ? { color: colorHex } : undefined}
    />
  );
}
