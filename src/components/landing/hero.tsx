"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { DashboardPreview } from "./dashboard-preview";
import { useState, useEffect, useRef } from "react";
import HeroImage from "@/assets/images/landing-image-1.png";
import MetaBusinessPartnerImage from "@/assets/images/meta-bussiness-partner.png";
import GoogleForStartupsImage from "@/assets/images/google-startup.png";
import { useFirebase } from "@/hooks/custom/use-firebase";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();
  const { signInAnonymously } = useFirebase();
  const [rotation, setRotation] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);

  const [zoomDirection, setZoomDirection] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const rotateX = useTransform(scrollY, [0, 400], [12, 0]);
  const scale = useTransform(scrollY, [0, 400], [0.98, 1]);
  const translateY = useTransform(scrollY, [0, 400], [0, -30]);
  const opacity = useTransform(scrollY, [0, 200], [1, 1]);

  const handleTryLinkAIForFree = () => {
    signInAnonymously().then(() => {
      router.push("/agents");
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageZoom((prev) => {
        const newZoom = prev + 0.001 * zoomDirection;
        if (newZoom >= 1.1) {
          setZoomDirection(-1);
          return 1.1;
        }
        if (newZoom <= 1) {
          setZoomDirection(1);
          return 1;
        }
        return newZoom;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [zoomDirection]);

  return (
    <section
      className="flex flex-col items-center text-center relative mx-auto w-full"
      ref={containerRef}
    >
      <div className="relative w-full">
        {/* Image container */}
        <div className="relative w-full overflow-hidden">
          <Image
            src={HeroImage}
            alt="Mountain landscape"
            width={1920}
            height={800}
            priority
            quality={100}
            className="w-full h-auto transition-transform duration-700 ease-out"
            style={{
              transform: `scale(${imageZoom})`,
              transformOrigin: "center center",
            }}
            sizes="100vw"
          />

          <div
            className="absolute bottom-0 left-0 right-0 h-[25%] pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.6) 60%, rgba(255,255,255,0.85) 80%, white 100%)",
            }}
          />

          {/* Content overlay on top of image */}
          <div className="absolute inset-0 flex flex-col items-center justify-start px-4 pt-20 md:pt-24 lg:pt-28">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center gap-28 mb-3"
            >
              <div className="group cursor-pointer">
                <Image
                  src={GoogleForStartupsImage}
                  alt="Google for Startups"
                  width={480}
                  height={120}
                  className="h-32 w-auto transition-all duration-300"
                  // style={{
                  //   filter: "grayscale(100%) brightness(0) invert(100%)",
                  // }}
                />
              </div>
              <div className="group cursor-pointer">
                <Image
                  src={MetaBusinessPartnerImage}
                  alt="Meta Business Partner"
                  width={10}
                  height={40}
                  className="h-10 w-auto transition-all duration-300"
                  // style={{
                  //   filter: "grayscale(100%) brightness(0) invert(100%)",
                  // }}
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-white text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight text-balance drop-shadow-lg"
              // style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
            >
              AI That Talks Like a Human
              <br />
              <span className="text-white/80">
                And Connects to Your Business Like a System
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-white/90 text-lg md:text-xl lg:text-2xl font-medium leading-relaxed max-w-3xl mx-auto text-balance drop-shadow-md mt-4"
            >
              Setup in minutes. No credit card. No developers needed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-8"
            >
              {/* <Link href="/create-account"> */}
              <div className="relative group">
                <div
                  className="absolute -inset-[2px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
                  style={{
                    background: `conic-gradient(from ${rotation}deg, transparent 0%, transparent 60%, rgba(255,255,255,0.8) 70%, white 80%, rgba(255,255,255,0.8) 90%, transparent 95%, transparent 100%)`,
                  }}
                />
                <div
                  className="absolute -inset-[2px] rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `conic-gradient(from ${rotation}deg, transparent 0%, transparent 60%, rgba(255,255,255,0.8) 70%, white 80%, rgba(255,255,255,0.8) 90%, transparent 95%, transparent 100%)`,
                  }}
                />
                <Button
                  className=" cursor-pointer relative bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/30 px-10 py-6 rounded-full font-medium text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group/btn"
                  // onClick={handleTryLinkAIForFree}
                  onClick={handleTryLinkAIForFree}
                >
                  Start Free
                </Button>
              </div>
              {/* </Link> */}
            </motion.div>
          </div>
        </div>

        {/* Dashboard section */}
        <div
          className="relative -mt-32 md:-mt-48 lg:-mt-80 mx-auto max-w-7xl z-10 pb-0"
          style={{ perspective: "2000px" }}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-neutral-200/80 overflow-hidden"
            style={{
              rotateX,
              scale,
              y: translateY,
              opacity,
              transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            <DashboardPreview />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
