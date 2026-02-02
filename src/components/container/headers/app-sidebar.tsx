"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Logout01Icon,
  ArrowDown01Icon,
  Menu01Icon,
  Notification03Icon,
  ArrowRightDoubleIcon,
  ArrowLeftDoubleIcon,
  UserListIcon,
} from "@hugeicons/core-free-icons";
import LinkAILogo from "@/assets/images/linkai_favicon.jpeg";
import DemoUserProfileImage from "@/assets/images/demo-user-profile-image.avif";

import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { SIDEBAR_LINKS } from "@/constants/navigation";
import type { IconSvgElement } from "@hugeicons/react";
import { Lock } from "lucide-react";

type NavItemType = {
  label: string;
  icon: IconSvgElement;
  href?: string;
  new?: boolean;
  subItems?: { label: string; href: string; pro?: boolean; new?: boolean }[];
};

type AppSidebarProps = {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};

export const AppSidebar = ({
  isMobileOpen = false,
  onMobileClose,
  collapsed: externalCollapsed,
  onCollapsedChange,
}: AppSidebarProps = {}) => {
  const { session, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [notifications] = useState([
    // {
    //   id: 1,
    //   title: "New message",
    //   description: "You have a new message from John",
    //   time: "5m ago",
    //   read: false,
    // },
    // {
    //   id: 2,
    //   title: "Agent updated",
    //   description: "Your AI agent has been updated successfully",
    //   time: "1h ago",
    //   read: false,
    // },
    // {
    //   id: 3,
    //   title: "System update",
    //   description: "New features available",
    //   time: "2h ago",
    //   read: true,
    // },
  ]);

  // Use external collapsed state if provided, otherwise use internal state
  const collapsed =
    externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const setCollapsed = onCollapsedChange || setInternalCollapsed;
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Derive userAnonymous directly from session instead of using state
  const userAnonymous = session.user?.auth_type === "anonymous";

  const unreadCount = 0;

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobileOpen && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getUserInitials = (email?: string, name?: string) => {
    if (name) {
      const names = name.split(" ");
      return names.length >= 2
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : names[0].substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const userEmail = session?.user?.email || "user@example.com";
  const userName = session?.user?.name || "";
  const displayName = userName || userEmail.split("@")[0];
  const userInitials = getUserInitials(userEmail, userName);

  // Debug avatar and reset error state when avatar changes
  useEffect(() => {
    if (session?.user) {
      console.log("User avatar URL:", session.user.avatar);
      console.log("User data:", session.user);
      setImageError(false); // Reset error state when user changes
    }
  }, [session?.user?.avatar]);

  // Check if path is active
  const isActive = useCallback(
    (path: string) => {
      if (path === pathname) return true;
      return pathname.startsWith(path + "/");
    },
    [pathname],
  );

  // Convert SIDEBAR_LINKS to support submenu structure
  const navItems: NavItemType[] = SIDEBAR_LINKS.map((link) => ({
    label: link.label,
    icon: link.icon,
    href: link.href,
    subItems: undefined, // Can be extended later
  }));

  // Handle submenu toggle
  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu === index) {
        return null;
      }
      return index;
    });
  };

  // Auto-open submenu if path matches
  useEffect(() => {
    let matchedIndex: number | null = null;

    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.href)) {
            matchedIndex = index;
          }
        });
      }
    });

    if (openSubmenu !== matchedIndex) {
      setOpenSubmenu(matchedIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Calculate submenu height
  useEffect(() => {
    if (openSubmenu !== null) {
      if (subMenuRefs.current[openSubmenu]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [openSubmenu]: subMenuRefs.current[openSubmenu]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const isExpanded = collapsed ? false : true;
  const shouldShowFullContent = isExpanded;

  // Render menu items with submenu support
  const renderMenuItems = (items: NavItemType[]) => (
    <ul
      className="flex flex-col gap-1 "
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      {items.map((nav, index) => (
        <li key={nav.label}>
          {nav.subItems ? (
            // Menu item with submenu
            <>
              <button
                onClick={() => handleSubmenuToggle(index)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 w-full rounded-2xl transition-all duration-200",
                  "text-muted-foreground hover:bg-muted/50 group",
                  !shouldShowFullContent && "justify-center px-2",
                  openSubmenu === index && "bg-muted text-foreground",
                )}
              >
                <HugeiconsIcon
                  icon={nav.icon}
                  className={cn(
                    "size-5 shrink-0 transition-colors",
                    openSubmenu === index && "text-blue-600",
                  )}
                />
                {shouldShowFullContent && (
                  <>
                    <span className="text-sm font-medium">{nav.label}</span>
                    {nav.new && (
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-blue-600/10 text-blue-600 font-semibold">
                        NEW
                      </span>
                    )}
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      className={cn(
                        "ml-auto w-4 h-4 transition-transform duration-200",
                        openSubmenu === index && "rotate-180",
                      )}
                    />
                  </>
                )}
              </button>
              {nav.subItems && shouldShowFullContent && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[index] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu === index
                        ? `${subMenuHeight[index]}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-1 space-y-0.5 ml-9 mb-1">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.label}>
                        <Link
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                            "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                            isActive(subItem.href) &&
                              "bg-blue-600/10 text-blue-600 font-medium",
                          )}
                        >
                          <span>{subItem.label}</span>
                          {subItem.new && (
                            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-blue-600/10 text-blue-600 font-semibold">
                              NEW
                            </span>
                          )}
                          {subItem.pro && (
                            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-amber-600/10 text-amber-600 font-semibold">
                              PRO
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            // Simple menu item without submenu
            nav.href && (
              <Tooltip disableHoverableContent={shouldShowFullContent}>
                <TooltipTrigger asChild>
                  <Link
                    href={nav.href}
                    id={`sidebar-${nav.label
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      "text-muted-foreground hover:bg-muted/50 group",
                      !shouldShowFullContent && "justify-center px-2",
                      isActive(nav.href) &&
                        "bg-blue-600 hover:bg-blue-600/90 text-white shadow-md shadow-blue-600/20",
                    )}
                  >
                    <HugeiconsIcon
                      icon={nav.icon}
                      className="size-5 shrink-0"
                    />
                    {shouldShowFullContent && (
                      <>
                        <span className="text-sm font-medium">{nav.label}</span>
                        {nav.new && (
                          <span
                            className={cn(
                              "ml-auto text-[10px] px-1.5 py-0.5 rounded font-semibold",
                              isActive(nav.href)
                                ? "bg-white/20 text-white"
                                : "bg-blue-600/10 text-blue-600",
                            )}
                          >
                            NEW
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </TooltipTrigger>
                {!shouldShowFullContent && (
                  <TooltipContent side="right">{nav.label}</TooltipContent>
                )}
              </Tooltip>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col h-full transition-all duration-300 ease-in-out shrink-0 rounded-xl relative",
          "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
          "xl:sticky xl:top-0",
          "fixed xl:relative left-0 top-0 z-50",
          collapsed ? "w-[90px] px-2" : "w-[290px] px-5",
          "",
          // Mobile: hide by default, show when open
          !isMobileOpen && "-translate-x-full xl:translate-x-0",
        )}
      >
        {/* Logo Section */}
        <div
          className={cn(
            "py-8 flex relative",
            !shouldShowFullContent ? "justify-center" : "justify-start",
          )}
        >
          <Link href="/">
            {shouldShowFullContent ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden">
                  <Image
                    src={LinkAILogo}
                    alt="LinkAI Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-semibold text-xl">LinkAI</span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <Image
                  src={LinkAILogo}
                  alt="LinkAI Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar overflow-x-hidden flex-1">
          <nav className="mb-6">
            <div className="flex flex-col gap-6">
              {/* Menu Section */}
              <div>
                {/* <h2
                  className={cn(
                    "mb-3 text-xs uppercase flex leading-5 text-gray-400 font-semibold tracking-wider",
                    !shouldShowFullContent ? "justify-center" : "justify-start"
                  )}
                >
                  {shouldShowFullContent ? (
                    "MENU"
                  ) : (
                    // <HugeiconsIcon icon={Menu01Icon} className="w-4 h-4" />
                    <></>
                  )}
                </h2> */}
                {userAnonymous ? (
                  // Dimmed menu for anonymous users
                  <ul
                    className={cn(
                      "flex flex-col gap-1 justify-center",
                      isExpanded ? "items-start" : "items-center",
                    )}
                  >
                    {navItems.slice(0, 4).map((nav) => (
                      <li key={nav.label}>
                        {shouldShowFullContent ? (
                          // Expanded state - show label
                          <div className="flex items-center justify-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground opacity-40 pointer-events-none">
                            <HugeiconsIcon
                              icon={nav.icon}
                              className="size-5 shrink-0"
                            />
                            <span className="text-sm font-medium">
                              {nav.label}
                            </span>
                          </div>
                        ) : (
                          // Collapsed state - icon only with tooltip
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground opacity-40 pointer-events-none cursor-not-allowed">
                                <HugeiconsIcon
                                  icon={nav.icon}
                                  className="size-5 shrink-0"
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p>{nav.label}</p>
                              <p className="text-xs text-muted-foreground">
                                Login required
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  // Full menu for logged-in users
                  renderMenuItems(navItems)
                )}
              </div>
            </div>
          </nav>

          {/* Login Banner for Anonymous Users */}
          {userAnonymous && (
            <div
              className={cn(
                "flex items-center justify-center pb-4",
                !shouldShowFullContent && "px-0",
              )}
            >
              <div
                className={cn(
                  "flex flex-col items-center gap-4 p-5 rounded-xl border-2 border-blue-600/20",
                  "bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
                  "backdrop-blur-sm transition-all duration-200 shadow-lg",
                  !shouldShowFullContent
                    ? "px-3 py-4 w-auto mx-auto"
                    : "w-full",
                )}
              >
                {shouldShowFullContent ? (
                  <>
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/40 ring-4 ring-blue-100/50 dark:ring-blue-900/20">
                      <Image
                        src={LinkAILogo}
                        alt="LinkAI Logo"
                        width={32}
                        height={32}
                        className="w-8 h-8 object-cover rounded"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center">
                      <h3 className="font-bold text-base text-foreground">
                        Welcome to LinkAI
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Sign in or create an account to unlock all features and
                        start managing your{" "}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-block cursor-help underline decoration-dotted">
                              <b>
                                <u>AI agents</u>
                              </b>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>
                              Create AI agent by clicking on the{" "}
                              <b>Create New Agent</b> card or button .
                            </p>
                          </TooltipContent>
                        </Tooltip>{" "}
                        and{" "}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-block cursor-help underline decoration-dotted">
                              <b>
                                <u>customers</u>
                              </b>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>
                              To Manage customers, please Create an account or
                              Sign in to your account.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                        .
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <Link href="/login" className="w-full">
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md cursor-pointer"
                          size="sm"
                        >
                          Log In
                        </Button>
                      </Link>
                      <Link href="/create-account" className="w-full">
                        <Button
                          variant="outline"
                          className="w-full border-2 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/50 font-semibold hover:text-gray-400 cursor-pointer"
                          size="sm"
                        >
                          Create Account
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/login">
                        <Button
                          size="icon"
                          className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                        >
                          <Lock className="size-5" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="font-semibold">Login Required</p>
                      <p className="text-xs">Sign in to access features</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button - Right Border */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute top-8 translate-x-1/2 z-50 ",
            "w-7 h-7 rounded-full bg-background border-2 border-gray-200 dark:border-gray-800",
            "hidden xl:flex items-center justify-center",
            "hover:bg-muted hover:border-gray-300 dark:hover:border-gray-700",
            "transition-all duration-300 ease-in-out",
            "shadow-lg hover:shadow-xl hover:scale-110",
            "group",
            collapsed ? "right-0" : "right-8",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <HugeiconsIcon
              icon={ArrowRightDoubleIcon}
              className={cn(
                "w-4 h-4 text-muted-foreground group-hover:text-foreground",
                "transition-transform duration-300 ease-in-out",
                "rotate-0",
              )}
            />
          ) : (
            <HugeiconsIcon
              icon={ArrowLeftDoubleIcon}
              className={cn(
                "w-4 h-4 text-muted-foreground group-hover:text-foreground",
                "transition-transform duration-300 ease-in-out",
                "rotate-0",
              )}
            />
          )}
        </button>

        {/* User Profile Section - Bottom */}
        <div className="pb-4 flex items-center justify-center ">
          {userAnonymous ? (
            // Guest user placeholder - dimmed
            shouldShowFullContent ? (
              <div className="opacity-30 pointer-events-none">
                <div className="flex items-center gap-3 w-full p-2 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold text-sm">
                    ?
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold">Guest User</p>
                  </div>
                </div>
              </div>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg opacity-30 pointer-events-none cursor-not-allowed">
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold text-sm">
                      ?
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-semibold">Guest User</p>
                  <p className="text-xs text-muted-foreground">
                    Login to access profile
                  </p>
                </TooltipContent>
              </Tooltip>
            )
          ) : (
            // Logged-in user profile
            <DropdownMenu>
              {shouldShowFullContent ? (
                <div className="flex flex-col items-start justify-center w-full">
                  {/* Notification Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      className="w-full bg-gray-100 flex items-start"
                    >
                      <Button
                        id="sidebar-notifications"
                        className="relative flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-400 hover:text-gray-200 dark:hover:bg-gray-800 transition-colors duration-200 mb-3 group cursor-pointer"
                        aria-label="Notifications"
                      >
                        <HugeiconsIcon
                          icon={Notification03Icon}
                          className="size-5 transition-transform group-hover:scale-110"
                        />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 border-2 border-background flex items-center justify-center px-1">
                            <span className="text-[10px] font-bold text-white leading-none">
                              {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          No notifications
                        </div>
                      ) : (
                        <>
                          {/* {notifications.map((notification) => (
                            <DropdownMenuItem
                              key={notification.id}
                              className={cn(
                                "flex flex-col items-start gap-1 p-3 group cursor-pointer",
                                !notification.read &&
                                  "bg-blue-50 dark:bg-blue-950/20"
                              )}
                            >
                              <div className="flex w-full items-start justify-between">
                                <p className="text-sm font-medium group-hover:text-gray-200 dark:group-hover:text-gray-200 duration-75 ease-in transition-all">
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground group-hover:text-gray-200 dark:group-hover:text-gray-200 duration-75 ease-in transition-all">
                                {notification.description}
                              </p>
                              <p className="text-xs text-muted-foreground group-hover:text-gray-200 dark:group-hover:text-gray-200 duration-75 ease-in transition-all">
                                {notification.time}
                              </p>
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="justify-center cursor-pointer text-sm font-medium text-blue-600">
                            View all notifications
                          </DropdownMenuItem> */}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenuTrigger asChild>
                    <div
                      id="sidebar-settings"
                      className="flex items-center gap-4 w-full rounded-lg group  cursor-pointer bg-gray-50 hover:bg-gray-100 border border-blue-200/50 hover:border-blue-300/50 duration-200 ease-in transition-all text-black p-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-semibold text-sm relative overflow-hidden shrink-0">
                        {session?.user?.avatar && !imageError ? (
                          <img
                            src={session.user.avatar}
                            alt={displayName}
                            className="w-10 h-10 object-cover rounded-full"
                            onError={(e) => {
                              console.error(
                                "Image failed to load:",
                                session.user.avatar,
                              );
                              setImageError(true);
                            }}
                          />
                        ) : (
                          <Image
                            src={DemoUserProfileImage}
                            alt={displayName}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover rounded-full"
                          />
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {userEmail}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    align="start"
                    className="w-56"
                  >
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {displayName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userEmail}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => router.push("/profile")}
                      className="cursor-pointer text-gray-600 hover:text-gray-600 hover:bg-gray-600/10 focus:text-gray-600 focus:bg-gray-600/10"
                    >
                      <HugeiconsIcon
                        icon={UserListIcon}
                        className="mr-2 h-4 w-4"
                      />
                      <span>Profile</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                    >
                      <HugeiconsIcon
                        icon={Logout01Icon}
                        className="mr-2 h-4 w-4 text-red-600"
                      />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  {/* Notification Dropdown - Collapsed State */}
                  <DropdownMenu>
                    <Tooltip>
                      <DropdownMenuTrigger
                        asChild
                        className="w-full bg-gray-100"
                      >
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-12 h-12 mb-3 hover:bg-muted/50 flex items-center justify-center"
                            aria-label="Notifications"
                          >
                            <div className="relative">
                              <HugeiconsIcon
                                icon={Notification03Icon}
                                className="h-6 w-6 text-muted-foreground"
                              />
                              {unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 border-2 border-background flex items-center justify-center px-1">
                                  <span className="text-[10px] font-bold text-white leading-none">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                  </span>
                                </div>
                              )}
                            </div>
                          </Button>
                        </TooltipTrigger>
                      </DropdownMenuTrigger>
                      <TooltipContent side="right">
                        <p>Notifications</p>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent align="end" className="w-80">
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          No notifications
                        </div>
                      ) : (
                        <>
                          {/* {notifications.map((notification) => (
                            <DropdownMenuItem
                              key={notification.id}
                              className={cn(
                                "flex flex-col items-start gap-1 p-3 group cursor-pointer",
                                !notification.read &&
                                  "bg-blue-50 dark:bg-blue-950/20"
                              )}
                            >
                              <div className="flex w-full items-start justify-between">
                                <p className="text-sm font-medium group-hover:text-gray-200 dark:group-hover:text-gray-200 duration-75 ease-in transition-all">
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground group-hover:text-gray-200 dark:group-hover:text-gray-200 duration-75 ease-in transition-all">
                                {notification.description}
                              </p>
                              <p className="text-xs text-muted-foreground group-hover:text-gray-200 dark:group-hover:text-gray-200 duration-75 ease-in transition-all">
                                {notification.time}
                              </p>
                            </DropdownMenuItem>
                          ))} */}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="justify-center cursor-pointer text-sm font-medium text-blue-600">
                            View all notifications
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Profile Dropdown - Collapsed State */}
                  <Tooltip>
                    <DropdownMenuTrigger
                      asChild
                      className="w-full bg-gray-100 hover:bg-muted/50 transition-colors group cursor-pointer rounded-lg"
                    >
                      <TooltipTrigger asChild>
                        <div
                          id="sidebar-settings"
                          className="flex items-center justify-center w-full p-2 rounded-lg"
                        >
                          {session?.user?.avatar && !imageError ? (
                            <Image
                              src={session.user.avatar}
                              alt={displayName}
                              width={40}
                              height={40}
                              className="w-10 h-10 object-cover rounded-full"
                              unoptimized
                              onError={(e) => {
                                console.error(
                                  "Image failed to load:",
                                  session.user.avatar,
                                );
                                setImageError(true);
                              }}
                            />
                          ) : (
                            <Image
                              src={DemoUserProfileImage}
                              alt={displayName}
                              width={40}
                              height={40}
                              className="w-10 h-10 object-cover rounded-full"
                            />
                          )}
                        </div>
                      </TooltipTrigger>
                    </DropdownMenuTrigger>
                    <TooltipContent side="right">
                      <div>
                        <p className="font-semibold">{displayName}</p>
                        <p className="text-xs text-muted-foreground">
                          {session?.user?.email}
                        </p>
                      </div>
                    </TooltipContent>
                    <DropdownMenuContent
                      side="top"
                      align="start"
                      className="w-56"
                    >
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {displayName}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {userEmail}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => router.push("/profile")}
                        className="cursor-pointer text-gray-600 hover:text-gray-600 hover:bg-gray-600/10 focus:text-gray-600 focus:bg-gray-600/10"
                      >
                        <HugeiconsIcon
                          icon={UserListIcon}
                          className="mr-2 h-4 w-4"
                        />
                        <span>Profile</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                      >
                        <HugeiconsIcon
                          icon={Logout01Icon}
                          className="mr-2 h-4 w-4 text-red-600"
                        />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </Tooltip>
                </div>
              )}
            </DropdownMenu>
          )}
        </div>
      </aside>
    </>
  );
};
