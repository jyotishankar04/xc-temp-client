"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  children: React.ReactNode;
}

export function Sidebar({ className, children }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col h-screen border-r bg-sidebar transition-all duration-300",
        className
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex h-14 items-center border-b px-4", className)}>
      {children}
    </div>
  );
}

export function SidebarContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <nav className={cn("flex-1 overflow-y-auto p-2", className)}>
      {children}
    </nav>
  );
}

export function SidebarFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("border-t p-2", className)}>
      {children}
    </div>
  );
}

interface SidebarGroupProps {
  className?: string;
  children: React.ReactNode;
}

export function SidebarGroup({ className, children }: SidebarGroupProps) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function SidebarGroupLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn(
      "px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
      className
    )}>
      {children}
    </div>
  );
}

export function SidebarGroupContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <ul className={cn("space-y-1", className)}>{children}</ul>;
}

interface SidebarItemProps {
  href?: string;
  icon?: React.ElementType;
  label: string;
  isActive?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ 
  href, 
  icon: Icon, 
  label, 
  isActive, 
  collapsed,
  onClick 
}: SidebarItemProps) {
  const content = (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        collapsed && "justify-center"
      )}
      onClick={onClick}
    >
      {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
      {!collapsed && <span>{label}</span>}
    </div>
  );

  if (href) {
    return (
      <li>
        <a href={href}>{content}</a>
      </li>
    );
  }

  return <li>{content}</li>;
}

export function SidebarSeparator({ className }: { className?: string }) {
  return <div className={cn("my-2 border-t", className)} />;
}
