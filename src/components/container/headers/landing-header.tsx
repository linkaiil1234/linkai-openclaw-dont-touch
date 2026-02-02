"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  Bot,
  MessageSquare,
  Info,
  DollarSign,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SITE_CONFIG } from "@/constants/common";
import { useFirebase } from "@/hooks/custom/use-firebase";
import Image from "next/image";
import LinkAILogo from "@/assets/images/linkai_favicon.jpeg";

type LandingHeaderProps = {
  isChat?: boolean;
};

// Navigation items for dropdowns
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
    name: "About",
    description: "Learn more about us",
    href: SITE_CONFIG.baseLinks.about,
    icon: Info,
    external: false,
  },
  {
    name: "Pricing",
    description: "View our pricing plans",
    href: SITE_CONFIG.baseLinks.pricing,
    icon: DollarSign,
    external: false,
  },
  {
    name: "Changelog",
    description: "See what's new",
    href: SITE_CONFIG.baseLinks.changelog,
    icon: Clock,
    external: false,
  },
];

export const LandingHeader = ({ isChat = false }: LandingHeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const router = useRouter();
  const { signInAnonymously } = useFirebase();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 600);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const handleTryLinkAIForFree = () => {
    signInAnonymously().then(() => {
      router.push("/agents");
    });
  };

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor:
          scrolled || isChat ? "rgba(255, 255, 255, 0.98)" : "transparent",
        backdropFilter: scrolled || isChat ? "blur(20px)" : "blur(0px)",
        boxShadow: scrolled || isChat ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 w-full py-4 px-6 md:px-12"
      role="banner"
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="w-full flex items-center justify-between">
        {/* Left side - Logo and Nav */}
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label={`${SITE_CONFIG.name} Home`}
          >
            <Image
              src={LinkAILogo}
              alt="LinkAI Logo"
              width={32}
              height={32}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <motion.span
              animate={{
                color: scrolled || isChat ? "#0a0a0a" : "#ffffff",
              }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-semibold tracking-tight"
            >
              {SITE_CONFIG.name.toUpperCase()}
            </motion.span>
          </Link>

          {/* Nav with dropdowns */}
          {/* <nav
            className="hidden md:flex items-center gap-1"
            role="navigation"
            aria-label="Main navigation"
          >
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("products")}
            >
              <button
                className="px-4 py-2 rounded-full font-medium transition-colors text-base flex items-center gap-1"
                style={{
                  color: scrolled || isChat ? "#666" : "rgba(255,255,255,0.9)",
                }}
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
                      {products.map((item) => {
                        const IconComponent = item.icon;
                        return (
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
                              <IconComponent className="w-5 h-5 text-white/70" />
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
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("company")}
            >
              <button
                className="px-4 py-2 rounded-full font-medium transition-colors text-base flex items-center gap-1"
                style={{
                  color: scrolled || isChat ? "#666" : "rgba(255,255,255,0.9)",
                }}
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
                      {company.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                              <IconComponent className="w-5 h-5 text-white/70" />
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
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav> */}
        </div>

        {/* Right side - Auth buttons */}
        <div className="flex items-center gap-3">
          {/* <Link href="/login" className="hidden md:block">
            <Button
              variant="ghost"
              className="font-medium text-base"
              style={{
                color: scrolled || isChat ? "#666" : "#0a0a0a",
              }}
            >
              Login
            </Button>
          </Link> */}
          <button onClick={handleTryLinkAIForFree} className="hidden md:block">
            <motion.div
              animate={{
                backgroundColor: scrolled || isChat ? "#0a0a0a" : "#ffffff",
                color: scrolled || isChat ? "#ffffff" : "#0a0a0a",
              }}
              transition={{ duration: 0.3 }}
              className="px-6 py-2.5 rounded-full font-medium text-base shadow-sm transition-all duration-300 hover:shadow-md group flex items-center"
            >
              Sign In For Free
              <ChevronRight
                className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform"
                aria-hidden="true"
              />
            </motion.div>
          </button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                style={{
                  color: scrolled || isChat ? "#0a0a0a" : "#ffffff",
                }}
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
                  {products.map((item) => {
                    const IconComponent = item.icon;
                    return (
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
                        <IconComponent className="w-5 h-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                {/* Company section */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2 px-4">
                    Company
                  </p>
                  {company.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 px-4 py-3 rounded-lg text-base font-medium transition-colors"
                      >
                        <IconComponent className="w-5 h-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                <div
                  className="border-t border-border my-4"
                  aria-hidden="true"
                />
                <Link
                  href="/login"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Button
                    variant="outline"
                    className="w-full px-6 py-3 rounded-full font-medium bg-transparent"
                  >
                    Login
                  </Button>
                </Link>
                <button
                  className="w-full mt-2"
                  onClick={() => {
                    handleTryLinkAIForFree();
                    setIsOpen(false);
                  }}
                >
                  <Button className="w-full bg-foreground text-background hover:bg-foreground/90 px-6 py-3 rounded-full font-medium shadow-sm">
                    Sign In For Free
                  </Button>
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};
