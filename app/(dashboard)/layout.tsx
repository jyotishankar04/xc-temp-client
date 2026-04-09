"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  Settings,
  Users,
  Key,
  ArrowLeftRight,
  Bell,
  ChevronLeft,
  ChevronRight,
  Search,
  LogOut,
  Loader2,
  ChevronDown,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

interface Organization {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

const sidebarItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/services", label: "Services", icon: Activity },
  { href: "/dashboard/cases", label: "Incidents", icon: AlertTriangle },
  { href: "/dashboard/rca", label: "RCA Reports", icon: Activity },
  { href: "/dashboard/rollback", label: "Rollback", icon: ArrowLeftRight },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [org, setOrg] = useState<Organization | null>(null);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserAndOrg = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        
        const [userRes, orgRes] = await Promise.all([
          fetch(`${baseUrl}/api/auth/me`, { credentials: "include" }),
          fetch(`${baseUrl}/api/v1/orgs/current`, { credentials: "include" }),
        ]);

        const [userData, orgData] = await Promise.all([
          userRes.json(),
          orgRes.json(),
        ]);

        if (userData.success) {
          setUser(userData.data?.session?.user || userData.data?.user || userData.data);
        }
        if (orgData.success) {
          setOrg(orgData.data);
        }
      } catch (err) {
        console.error("Failed to fetch user/org:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserAndOrg();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/signout`,
        { method: "POST", credentials: "include" }
      );
      router.push("/login");
    } catch (err) {
      router.push("/login");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-white">XC</span>
            </div>
            {!collapsed && (
              <span className="font-semibold text-lg">XecureCode</span>
            )}
          </Link>
        </div>

        {/* Organization Switcher */}
        {!collapsed && (
          <div className="border-b px-3 py-2">
            <Button
              variant="outline"
              className="w-full justify-between h-9"
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            >
              <div className="flex items-center gap-2 truncate">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{org?.name || "Select Org"}</span>
              </div>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section at Bottom */}
        <div className="border-t p-3">
          {loadingUser ? (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-primary text-white text-xs">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              )}
              {!collapsed && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
              {collapsed && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
          
          {/* Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full mt-2",
              collapsed && "px-0"
            )}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b bg-background px-4">
          {/* Search */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search incidents, services..."
              className="pl-9 bg-muted/50"
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}