# UI Registry — Habit & Goal Tracker

This registry documents established visual patterns across the application to ensure complete design consistency across all screens, components, and phases.

## Baseline — Established 2026-07-08

Established from the initial landing page mockups for **AbiFlo**.

| Property | Correct Class / Style | Note |
|---|---|---|
| Background (Dark) | `bg-background` (oklch(0.1 0 0)) | Rich charcoal black background |
| Container Card | `border border-border bg-card/45 backdrop-blur-xs` | Glassmorphism card style |
| Borders | `border-border` (oklch(1 0 0 / 8%)) | Subtle, thin white borders with low opacity |
| Accent Color | `bg-brand`, `text-brand` (oklch(0.69 0.17 18)) | Brand Coral Accent (`#F87171` style) |
| Text - Primary | `text-foreground` (oklch(0.985 0 0)) | Off-white |
| Text - Secondary | `text-muted-foreground` (oklch(0.6 0 0)) | Mid-gray |
| Fonts - Sans | `font-sans` (Geist Sans) | Interface, controls, body |
| Fonts - Serif | `font-serif` (Playfair Display) | Editorial headings (italic accents) |
| Radius - Card | `rounded-2xl` | Main dashboard & pricing cards |
| Radius - Grid Card | `rounded-xl` | Feature grid cards |
| Radius - Controls | `rounded-lg` | Buttons, badge, inputs |

---

### Navbar

**File:** [Navbar.tsx](file:///Users/adebowaleademuyiwa/Documents/Web-dev/Nestjs/Habit-Tracker/frontend/components/landing/Navbar.tsx)
**Spacing:** `h-16 px-6 lg:px-8`
**Transitions:** `transition-all duration-300` (transparent to frosted backdrop shadow-lg on scroll)

### Hero Dashboard Preview Card

**File:** [Hero.tsx](file:///Users/adebowaleademuyiwa/Documents/Web-dev/Nestjs/Habit-Tracker/frontend/components/landing/Hero.tsx)
**Border radius:** `rounded-2xl`
**Shadow:** `shadow-2xl shadow-black/40`
**Highlights:** Emerald (`oklch(0.796 0.265 142.495)`) for active status, Brand Coral for accents & streaks.

### Pricing Card

**File:** [Pricing.tsx](file:///Users/adebowaleademuyiwa/Documents/Web-dev/Nestjs/Habit-Tracker/frontend/components/landing/Pricing.tsx)
**Popular variant:** `border-brand ring-1 ring-brand/50 scale-[1.02] shadow-xl shadow-brand/5`
**Regular variant:** `border-border`
