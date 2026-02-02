import { Button } from "@/components/ui/button";
import {
  ArrowRight01Icon,
  Linkedin01Icon,
  TwitterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

// const pageLinks = [
// {
//   title: "Home",
//   href: "home",
// },
// {
//   title: "Features",
//   href: "features",
// },
// {
//   title: "Pricing",
//   href: "pricing",
// },
// {
//   title: "Contact",
//   href: "contact",
// },
// ];

// const legalLinks = [
//   {
//     title: "Terms of Service",
//     href: "/terms",
//   },
//   {
//     title: "Privacy Policy",
//     href: "/privacy",
//   },
// ];

export const Footer = () => {
  const router = useRouter();
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.1 * i,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const viewportOptions = { once: true, amount: 0.25 };

  return (
    <footer className="py-10 bg-linear-to-b from-muted to-sky-200">
      <div className="max-w-7xl w-full px-4 flex flex-col mx-auto gap-20 lg:gap-32">
        <div className="flex flex-col gap-6 sm:gap-8 items-center text-center">
          <div className="flex flex-col gap-3 sm:gap-4 items-center">
            <motion.h2
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOptions}
              custom={0}
              className="text-3xl sm:text-4xl lg:text-5xl"
            >
              Ready to get started?
            </motion.h2>
            <motion.p
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOptions}
              custom={0.8}
              className="text-sm text-muted-foreground"
            >
              Use LinkAI for your business needs.
            </motion.p>
          </div>
          <motion.div
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            custom={1.2}
          >
            <Button
              className="rounded-lg"
              onClick={() => router.push("/agents")}
            >
              Try LinkAI for free
            </Button>
          </motion.div>
        </div>
        <motion.div
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          custom={1.6}
          className="flex flex-col gap-10 rounded-2xl p-8 sm:p-10 bg-background/50 backdrop-blur-md"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
            <motion.div
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOptions}
              custom={1.8}
              className="flex flex-col gap-6 md:max-w-sm"
            >
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold text-2xl">LinkAI</h2>
                <p className="text-muted-foreground">
                  Your favourite business management software. Built for early
                  startup founders.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="size-10 bg-foreground rounded-full text-background flex items-center justify-center cursor-pointer hover:bg-foreground/80">
                  <HugeiconsIcon icon={Linkedin01Icon} size={20} />
                </button>
                <button className="size-10 bg-foreground rounded-full text-background flex items-center justify-center cursor-pointer hover:bg-foreground/80">
                  <HugeiconsIcon icon={TwitterIcon} size={20} />
                </button>
              </div>
            </motion.div>
            <motion.div
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOptions}
              custom={2}
              className="flex gap-10 sm:gap-12"
            >
              {/* <div className="flex flex-col gap-2">
                <h6 className="font-semibold">Pages</h6>
                <ul className="flex flex-col gap-2 text-muted-foreground">
                  {pageLinks.map((link, i) => (
                    <li key={i}>
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="hover:text-foreground cursor-pointer duration-500 transition-all"
                      >
                        {link.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div> */}
              {/* <div className="flex flex-col gap-2">
                <h6 className="font-semibold">Legal</h6>
                <ul className="flex flex-col gap-2 text-muted-foreground">
                  {legalLinks.map((link, i) => (
                    <li
                      key={i}
                      className="hover:text-foreground duration-500 transition-all"
                    >
                      <Link href={link.href}>{link.title}</Link>
                    </li>
                  ))}
                </ul>
              </div> */}
            </motion.div>
          </div>
          <motion.div
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            custom={2.2}
            className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t pt-6"
          >
            <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} LinkAI. All rights reserved.</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">Created by</span>
              <Link
                href="https://aritra360.com"
                target="_blank"
                className="font-semibold text-foreground hover:text-[#1A89FF] transition-colors duration-200 hover:underline underline-offset-4"
              >
                aritra360.com
              </Link>
              <span className="text-muted-foreground">&</span>
              <Link
                href="https://pritam-gain.vercel.app"
                target="_blank"
                className="font-semibold text-foreground hover:text-[#1A89FF] transition-colors duration-200 hover:underline underline-offset-4"
              >
                pritam-gain.vercel.app
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};
