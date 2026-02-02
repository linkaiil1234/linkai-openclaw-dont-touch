"use client";

import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  Users,
  Link2,
  ChevronRight,
  Bell,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "#" },
  { icon: Bot, label: "Agents", href: "#", active: true },
  { icon: MessageSquare, label: "Inbox", href: "#" },
  { icon: Users, label: "Customers", href: "#" },
  { icon: Link2, label: "Integrations", href: "#" },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-screen bg-sidebar flex flex-col transition-all duration-300 relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -left-3 top-8 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors z-10"
      >
        <ChevronRight
          className={`w-3 h-3 text-foreground transition-transform ${collapsed ? "" : "rotate-180"}`}
        />
      </button>

      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center shadow-lg">
          <span className="text-sidebar-primary-foreground font-bold text-lg">
            L
          </span>
        </div>
        {!collapsed && (
          <span className="text-sidebar-foreground font-semibold text-xl">
            LinkAI
          </span>
        )}
      </div>

      {/* Menu Label */}
      {!collapsed && (
        <div className="px-6 py-2">
          <span className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
            Menu
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              item.active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </a>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border">
        {/* Notification */}
        <button
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors mb-3 ${collapsed ? "justify-center" : ""}`}
        >
          <Bell className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Notifications</span>}
        </button>

        {/* User */}
        <div
          className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium shadow-md">
            123
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground font-medium truncate">
                123
              </p>
              <p className="text-sidebar-foreground/60 text-xs truncate">
                office1@linkail.com
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
