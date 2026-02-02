"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import MobileApp from "@/assets/images/mobileapp.avif";
import WebApp from "@/assets/images/webapp.avif";
import Image from "next/image";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  Variants,
} from "framer-motion";
import { Button } from "@/components/ui/button";

type DeviceVariant = "mobile" | "web";

export const Devices = () => {
  const [active, setActive] = useState<DeviceVariant>("mobile");
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.8], [1.2, 1]);

  const backgroundStyle = {
    backgroundImage:
      "radial-gradient(circle at 20% 20%, rgba(255,214,165,0.35), transparent 35%), radial-gradient(circle at 80% 10%, rgba(156,214,255,0.35), transparent 30%), radial-gradient(circle at 70% 80%, rgba(255,236,179,0.35), transparent 30%)",
  };

  const staggeredVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 2,
        delay: 0.1 * i,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section
      ref={sectionRef}
      className="mb-24 lg:mb-40 flex flex-col gap-8 sm:gap-10 items-center w-full px-4 text-center"
    >
      <motion.p
        variants={staggeredVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={0}
        className="text-sm uppercase tracking-wider text-muted-foreground font-semibold"
      >
        Seamless across devices
      </motion.p>
      <div className="flex flex-col text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight items-center">
        <motion.h2
          variants={staggeredVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={1}
        >
          Work from anywhere,
        </motion.h2>
        <motion.h2
          variants={staggeredVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={1.2}
        >
          stay in sync
        </motion.h2>
      </div>

      <motion.div
        variants={staggeredVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={2}
        className="relative w-full max-w-7xl"
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-80"
          style={backgroundStyle}
        />

        <div ref={containerRef} className="relative">
          <motion.div
            className={cn(
              "relative mx-auto overflow-hidden rounded-[42px] transition-all duration-500 ease-out",
              "max-w-5xl",
            )}
          >
            <motion.div
              className="relative aspect-4/3 w-full overflow-hidden"
              style={{ scale, transformOrigin: "center center" }}
            >
              <Image
                src={MobileApp}
                width={500}
                height={500}
                alt="Mobile preview"
                className={cn(
                  "absolute inset-0 size-full object-cover transition-all duration-500 ease-in-out will-change-transform",
                  active === "mobile"
                    ? "translate-x-0 opacity-100 z-10"
                    : "-translate-x-full opacity-0",
                )}
              />
              <Image
                src={WebApp}
                width={500}
                height={500}
                alt="Web preview"
                className={cn(
                  "absolute inset-0 size-full object-cover transition-all duration-500 ease-in-out will-change-transform",
                  active === "web"
                    ? "translate-x-0 opacity-100 z-10"
                    : "translate-x-full opacity-0",
                )}
              />
            </motion.div>
          </motion.div>

          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center rounded-full px-1 sm:px-2 py-1 sm:py-2 bg-background/20 backdrop-blur-sm shadow-2xl border border-foreground/5">
            <div className="relative grid grid-cols-2 gap-2">
              <div
                aria-hidden
                className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-foreground shadow-sm transition-transform duration-300 ease-out"
                style={{
                  transform:
                    active === "mobile" ? "translateX(0%)" : "translateX(100%)",
                }}
              />
              {(["mobile", "web"] as DeviceVariant[]).map((variant) => {
                const isActive = active === variant;
                const label = variant === "mobile" ? "Mobile view" : "Web view";
                return (
                  <Button
                    key={variant}
                    variant="ghost"
                    title={label}
                    className={cn(
                      "z-10 px-5 sm:px-8 py-2 sm:py-4 text-sm sm:text-base leading-none text-background bg-transparent hover:bg-transparent",
                      !isActive && "border border-background/20",
                    )}
                    type="button"
                    onClick={() => setActive(variant)}
                    aria-pressed={isActive}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
