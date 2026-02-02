"use client";

import { ReactNode, useState } from "react";

import { AppSidebar } from "@/components/container/headers/app-sidebar";
import { useAuth } from "@/providers/auth-provider";
import { ChatProvider } from "@/providers/chat-provider";
import { InboxProvider } from "@/providers/inbox-provider";
import { LoadingFullScreenDots } from "@/components/ui/loading";

const PrivateRouteLayout = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  console.log("session", session);

  if (session.loading || !session.user) {
    return <LoadingFullScreenDots message="Loading..." />;
  }

  const handleToggleSidebar = () => {
    // On mobile/tablet (< xl): toggle open/close
    // On desktop (>= xl): toggle collapse/expand
    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <ChatProvider>
      <InboxProvider>
        <div className="min-h-screen xl:flex bg-[#F9FAFB] dark:bg-gray-950 h-screen p-4 ">
          {/* Sidebar */}
          <AppSidebar
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
            collapsed={isSidebarCollapsed}
            onCollapsedChange={setIsSidebarCollapsed}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out px-2 rounded-xl xl:ml-0 overflow-hidden">
            {/* Header */}
            {/* Page Content */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
              <div className="w-full h-full rounded-xl bg-background">
                {children}
              </div>
            </div>
          </div>
        </div>
      </InboxProvider>
    </ChatProvider>
  );
};

export default PrivateRouteLayout;
