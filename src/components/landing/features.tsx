import {
  CheckListFreeIcons,
  File01Icon,
  DollarIcon,
  Clock01Icon,
  ListViewIcon,
  FolderCheckIcon,
  WorkflowCircleFreeIcons,
  ChartLineData01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { motion } from "framer-motion";
import Image from "next/image";
import Features1 from "@/assets/images/features-1.png";
import Features2 from "@/assets/images/features-2.png";
import { cn } from "@/lib/utils";
import { jakarta } from "@/lib/font";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Variants } from "framer-motion";

const features = [
  {
    eyebrow: "project management",
    image: Features1,
    heading: "Keep every project moving forward",
    description:
      "Plan, assign, and deliver your work - all in one place. With smart task tracking, deadlines, and real-time progress, you stay organized and clients stay confident.",
    badges: [
      {
        icon: (
          <HugeiconsIcon
            icon={CheckListFreeIcons}
            strokeWidth={1.5}
            size={20}
          />
        ),
        label: "Task",
      },
      {
        icon: <HugeiconsIcon icon={Clock01Icon} strokeWidth={1.5} size={20} />,
        label: "Time tracking",
      },
      {
        icon: <HugeiconsIcon icon={ListViewIcon} strokeWidth={1.5} size={20} />,
        label: "Timesheets",
      },
      {
        icon: <HugeiconsIcon icon={File01Icon} strokeWidth={1.5} size={20} />,
        label: "Reports",
      },
    ],
  },
  {
    eyebrow: "financial management",
    image: Features2,
    heading: "Keep every project moving forward",
    description:
      "Plan, assign, and deliver your work - all in one place. With smart task tracking, deadlines, and real-time progress, you stay organized and clients stay confident.",
    badges: [
      {
        icon: (
          <HugeiconsIcon icon={FolderCheckIcon} strokeWidth={1.5} size={20} />
        ),
        label: "Invoicing",
      },
      {
        icon: <HugeiconsIcon icon={DollarIcon} strokeWidth={1.5} size={20} />,
        label: "Budgets",
      },
      {
        icon: (
          <HugeiconsIcon
            icon={ChartLineData01Icon}
            strokeWidth={1.5}
            size={20}
          />
        ),
        label: "Forecasting",
      },
      {
        icon: (
          <HugeiconsIcon
            icon={WorkflowCircleFreeIcons}
            strokeWidth={1.5}
            size={20}
          />
        ),
        label: "Integrations",
      },
    ],
  },
];

export const Features = () => {
  const router = useRouter();

  const staggeredVariants: Variants = {
    hidden: { opacity: 0, y: 36 },
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

  const viewportOptions = { once: true, amount: 0.35 };

  return (
    <section
      className="max-w-7xl mx-auto w-full flex flex-col gap-20 lg:gap-32 px-4 py-16 sm:py-20"
      id="features"
    >
      {features.map((feature, index) => (
        <div
          key={index}
          className={cn(
            "grid grid-cols-1 lg:grid-cols-10 gap-10 lg:gap-16 items-center",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center rounded-2xl p-6 sm:p-8 bg-linear-to-b from-blue-200  to-orange-100 col-span-1 lg:col-span-6",
              index % 2 === 1 && "lg:order-2",
            )}
          >
            <Image
              src={feature.image}
              alt={feature.heading}
              width={200}
              height={400}
              className="rounded-xl h-[360px] sm:h-[460px] lg:h-[615px] w-full object-cover"
            />
          </div>
          <div
            className={cn(
              "col-span-1 lg:col-span-4 flex flex-col h-full justify-between gap-8",
              index % 2 === 1 && "lg:order-1",
            )}
          >
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <motion.p
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOptions}
                  custom={0}
                  variants={staggeredVariants}
                  className="uppercase text-sm"
                >
                  {feature.eyebrow}
                </motion.p>
                <motion.h2
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOptions}
                  custom={1}
                  variants={staggeredVariants}
                  className={cn(
                    "text-3xl sm:text-4xl lg:text-5xl leading-tight",
                    jakarta.className,
                  )}
                >
                  {feature.heading}
                </motion.h2>
                <motion.p
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOptions}
                  custom={1.6}
                  variants={staggeredVariants}
                  className="text-base sm:text-lg text-muted-foreground"
                >
                  {feature.description}
                </motion.p>
              </div>
              <Button
                // rounded="full"
                className="w-full sm:w-max hover:-translate-y-1 duration-500 hover:shadow-xl"
                size="lg"
                onClick={() => router.push("/login")}
              >
                Try LinkAI free
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {feature.badges.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-full justify-center border bg-background/60 text-sm sm:text-base"
                >
                  {badge.icon}
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};
