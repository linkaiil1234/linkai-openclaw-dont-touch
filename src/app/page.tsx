"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, LenisRef } from "lenis/react";
import { cancelFrame, frame } from "framer-motion";
import { redirect } from "next/navigation";
import { LandingHeader } from "@/components/container/headers/landing-header";
import { useAuth } from "@/providers/auth-provider";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/container/footer";
import { LogoStrip } from "@/components/landing/logo-strip";
import { Devices } from "@/components/landing/devices";
import { Pricing } from "@/components/landing/pricing";

export default function Home() {
  const { session } = useAuth();

  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      const time = data.timestamp;
      lenisRef.current?.lenis?.raf(time);
    }

    frame.update(update, true);

    return () => cancelFrame(update);
  }, []);

  if (session.user?.auth_type === "anonymous" && !session.loading) {
    redirect("/agents");
  }
  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <main className="size-full flex flex-col overflow-x-hidden">
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      <LandingHeader />
      <div className="flex-1 relative bg-muted">
        <Hero />
        {/* <LogoStrip /> */}
        {/* <Devices />
        <Features />
        <Pricing /> */}
      </div>
      <Footer />
    </main>
  );
}
