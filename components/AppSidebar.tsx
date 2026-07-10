"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
    LogOut,
    Home,
    CheckSquare,
    Target,
    Settings,
    ChevronsUpDown,
} from "lucide-react";
import { DASHBOARD_ROUTES } from "@/constants/routes";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
export const NAV_ITEMS = [
    { label: "Overview", href: DASHBOARD_ROUTES.HOME, icon: Home },
    { label: "Habits", href: DASHBOARD_ROUTES.HABITS, icon: CheckSquare },
    { label: "Goals", href: DASHBOARD_ROUTES.GOALS, icon: Target },
    { label: "Settings", href: DASHBOARD_ROUTES.SETTINGS, icon: Settings },
] as const;
interface AppSidebarProps {
    user: { name?: string | null; email?: string | null };
    avatarUrl?: string | null;
    onLogout: () => void;
}
export function AppSidebar({ user, avatarUrl, onLogout }: AppSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const userInitials = user.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "U";
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            {/* Header: Logo */}
            <SidebarHeader
                className="px-4 py-4 cursor-pointer"
                onClick={() => router.push("/")}
            >
                <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
                        <span className="hidden group-data-[collapsible=icon]:block">
                            A<span className="text-brand">o</span>
                        </span>
                        <span className="block group-data-[collapsible=icon]:hidden text-xl">
                            AbiFl<span className="text-brand">o</span>
                        </span>
                    </span>
                </div>
            </SidebarHeader>
            <Separator className="bg-sidebar-border" />
            {/* Navigation */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-widest text-sidebar-foreground/40">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {NAV_ITEMS.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== DASHBOARD_ROUTES.HOME &&
                                        pathname.startsWith(item.href));
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            isActive={isActive}
                                            tooltip={item.label}
                                            render={<Link href={item.href} />}
                                            className="h-9"
                                        >
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            {/* Footer: User Menu */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground cursor-pointer"
                                    />
                                }
                            >
                                <Avatar className="h-7 w-7 rounded-md">
                                    <AvatarImage
                                        src={avatarUrl || undefined}
                                        alt={user.name || "User"}
                                    />
                                    <AvatarFallback className="rounded-md bg-sidebar-accent text-[10px] font-semibold text-sidebar-accent-foreground">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-0.5 leading-none text-left">
                                    <span className="text-xs font-semibold truncate">
                                        {user.name}
                                    </span>
                                    <span className="text-[10px] text-sidebar-foreground/50 truncate">
                                        {user.email}
                                    </span>
                                </div>
                                <ChevronsUpDown className="ml-auto h-3.5 w-3.5 text-sidebar-foreground/40" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="min-w-56"
                                align="start"
                            >
                                <div className="flex items-center gap-2 px-2 py-1.5">
                                    <Avatar className="h-7 w-7 rounded-md">
                                        <AvatarImage
                                            src={avatarUrl || undefined}
                                            alt={user.name || "User"}
                                        />
                                        <AvatarFallback className="rounded-md text-[10px] font-semibold">
                                            {userInitials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="text-xs font-semibold">{user.name}</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {user.email}
                                        </span>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    render={<Link href={DASHBOARD_ROUTES.SETTINGS} />}
                                    className="flex items-center gap-2"
                                >
                                    <Settings className="h-3.5 w-3.5" />
                                    <span className="text-xs">Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={onLogout}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <LogOut className="h-3.5 w-3.5" />
                                    <span className="text-xs">Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}