"use client";

import { SwitchTheme } from "@/components/theme";
import NotificationDropdown from "@/components/container/headers/notification-dropdown";
import UserDropdown from "@/components/container/headers/user-dropdown";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Menu,
  Bot,
  MessageSquare,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";
import LinkAILogo from "@/assets/images/linkai_favicon.jpeg";

type AppHeaderProps = {
  onMobileMenuToggle?: () => void;
  isMobileSidebarOpen?: boolean;
};

// Placeholder navigation items - you can customize these
const products = [
  {
    name: "AI Agents",
    description: "Build and deploy AI agents",
    href: "/agents",
    icon: Bot,
    external: false,
  },
  {
    name: "Inbox",
    description: "Manage conversations",
    href: "/inbox",
    icon: MessageSquare,
    external: false,
  },
];

const company = [
  {
    name: "Dashboard",
    description: "View your analytics",
    href: "/dashboard",
    icon: LayoutDashboard,
    comingSoon: false,
  },
  {
    name: "Settings",
    description: "Manage your account",
    href: "/profile",
    icon: Settings,
    comingSoon: false,
  },
];

const AppHeader: React.FC<AppHeaderProps> = ({
  onMobileMenuToggle,
  isMobileSidebarOpen = false,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 600);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleNavScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
        setActiveDropdown(null);
      }
    }
  };

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.98)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 w-full py-4 px-6 md:px-12"
      role="banner"
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="w-full flex items-center justify-between">
        {/* Left side - Logo, Sidebar Toggle, and Nav */}
        <div className="flex items-center gap-4 md:gap-10">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onMobileMenuToggle}
            aria-label="Toggle Sidebar"
            className={`flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 rounded-lg border transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
              isMobileSidebarOpen
                ? "bg-gray-100 dark:bg-white/3 border-gray-200 dark:border-gray-800"
                : "bg-transparent border-gray-200 dark:border-gray-800"
            }`}
            style={{
              color: scrolled ? "#666" : "rgba(255,255,255,0.9)",
              borderColor: scrolled
                ? "rgba(0,0,0,0.1)"
                : "rgba(255,255,255,0.2)",
            }}
          >
            {isMobileSidebarOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-200"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-200"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2 4.75C2 4.33579 2.33579 4 2.75 4H17.25C17.6642 4 18 4.33579 18 4.75C18 5.16421 17.6642 5.5 17.25 5.5H2.75C2.33579 5.5 2 5.16421 2 4.75ZM2 10C2 9.58579 2.33579 9.25 2.75 9.25H17.25C17.6642 9.25 18 9.58579 18 10C18 10.4142 17.6642 10.75 17.25 10.75H2.75C2.33579 10.75 2 10.4142 2 10ZM2.75 14.5C2.33579 14.5 2 14.8358 2 15.25C2 15.6642 2.33579 16 2.75 16H17.25C17.6642 16 18 15.6642 18 15.25C18 14.8358 17.6642 14.5 17.25 14.5H2.75Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="LINKAI Home"
          >
            <Image
              src={LinkAILogo}
              alt="LinkAI Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-xl ml-4">
            <form>
              <div className="relative">
                <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search or type command..."
                  className="h-11 w-full rounded-lg border bg-transparent py-2.5 pl-12 pr-14 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-hidden focus:ring-3 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-white/3 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800 transition-all"
                  style={{
                    borderColor: scrolled
                      ? "rgba(0,0,0,0.1)"
                      : "rgba(255,255,255,0.2)",
                    color: scrolled ? "#0a0a0a" : "rgba(255,255,255,0.9)",
                  }}
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border px-[7px] py-[4.5px] text-xs -tracking-[0.2px] transition-all"
                  style={{
                    borderColor: scrolled
                      ? "rgba(0,0,0,0.1)"
                      : "rgba(255,255,255,0.2)",
                    backgroundColor: scrolled
                      ? "rgba(0,0,0,0.05)"
                      : "rgba(255,255,255,0.1)",
                    color: scrolled ? "#666" : "rgba(255,255,255,0.9)",
                  }}
                >
                  <span>⌘</span>
                  <span>K</span>
                </button>
              </div>
            </form>
          </div>

          {/* Nav with dropdowns - Desktop */}
          <nav
            className="hidden md:flex items-center gap-1"
            role="navigation"
            aria-label="Main navigation"
          >
            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("products")}
            >
              <button
                className="px-4 py-2 rounded-full font-medium transition-colors text-base flex items-center gap-1"
                style={{ color: scrolled ? "#666" : "rgba(255,255,255,0.9)" }}
              >
                Products
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeDropdown === "products" ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === "products" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-80 rounded-2xl overflow-hidden"
                    style={{
                      background: "rgba(30, 30, 30, 0.95)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div className="p-2">
                      {products.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={
                            item.external ? "noopener noreferrer" : undefined
                          }
                          onClick={(e) => handleNavScroll(e, item.href)}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                            <item.icon className="w-5 h-5 text-white/70" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white text-sm">
                                {item.name}
                              </span>
                            </div>
                            <p className="text-white/50 text-xs mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("company")}
            >
              <button
                className="px-4 py-2 rounded-full font-medium transition-colors text-base flex items-center gap-1"
                style={{ color: scrolled ? "#666" : "rgba(255,255,255,0.9)" }}
              >
                Company
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeDropdown === "company" ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === "company" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-72 rounded-2xl overflow-hidden"
                    style={{
                      background: "rgba(30, 30, 30, 0.95)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div className="p-2">
                      {company.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                            <item.icon className="w-5 h-5 text-white/70" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white text-sm">
                                {item.name}
                              </span>
                              {item.comingSoon && (
                                <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                  Soon
                                </span>
                              )}
                            </div>
                            <p className="text-white/50 text-xs mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <SwitchTheme />
            <NotificationDropdown />
          </div>
          <UserDropdown />

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                style={{ color: scrolled ? "#0a0a0a" : "#ffffff" }}
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-background border-l border-border w-80"
            >
              <SheetHeader>
                <SheetTitle className="text-left text-lg font-semibold text-foreground">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav
                className="flex flex-col gap-1 mt-8"
                role="navigation"
                aria-label="Mobile navigation"
              >
                {/* Products section */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2 px-4">
                    Products
                  </p>
                  {products.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      onClick={(e) => {
                        handleNavScroll(e, item.href);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 px-4 py-3 rounded-lg text-base font-medium transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Company section */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2 px-4">
                    Company
                  </p>
                  {company.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 px-4 py-3 rounded-lg text-base font-medium transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                      {item.comingSoon && (
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-auto">
                          Soon
                        </span>
                      )}
                    </Link>
                  ))}
                </div>

                <div
                  className="border-t border-border my-4"
                  aria-hidden="true"
                />
                <div className="flex items-center gap-2 px-4">
                  <SwitchTheme />
                  <NotificationDropdown />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

export default AppHeader;
