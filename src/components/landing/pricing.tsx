import { Tick02FreeIcons, FlashFreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";

export const Pricing = () => {
  const pricings = [
    {
      name: "Starter",
      price: 0,
      credits: "500 Credits",
      conversations: "50 conversations",
      description: "Perfect for testing and small pilots.",
      features: [
        "1 Agent",
        "WhatsApp Integration",
        "Community Support",
        "Basic Analytics",
      ],
      buttonLabel: "Current Plan",
      isCurrentPlan: true,
    },
    {
      name: "Growth",
      price: 29,
      credits: "5,000 Credits",
      conversations: "500 conversations",
      description: "For growing businesses needing scale.",
      features: [
        "5 Agents",
        "All Channels (IG, FB, Phone)",
        "Email Support",
        "Advanced Analytics",
        "File Uploads",
      ],
      buttonLabel: "Upgrade to Growth",
      isPopular: true,
    },
    {
      name: "Business",
      price: 99,
      credits: "25,000 Credits",
      conversations: "2,500 conversations",
      description: "Volume and enterprise-grade power.",
      features: [
        "Unlimited Agents",
        "Priority Support",
        "API Access",
        "Custom Functions",
        "Dedicated Account Manager",
      ],
      buttonLabel: "Upgrade to Business",
    },
  ];

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
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

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.12 * i,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const viewportOptions = { once: true, amount: 0.3 };

  return (
    <section
      className="w-full flex flex-col gap-14 items-center justify-center "
      id="pricing"
    >
      <div className="flex flex-col gap-4 items-center text-center max-w-3xl">
        <motion.h2
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          custom={0}
          className="text-2xl font-bold tracking-tight"
        >
          Choose Your Plan
        </motion.h2>
        <motion.p
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          custom={1}
          className=" text-muted-foreground text-sm font-medium "
        >
          Scale your AI workforce with plans designed for every stage of your
          business.
          <br />
          Credits renew monthly.
        </motion.p>
      </div>

      <motion.div
        className="flex items-start justify-center w-full max-w-6xl"
        variants={textVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOptions}
        custom={1.4}
      >
        {pricings.map((plan, index) => (
          <motion.div
            key={plan.name}
            variants={cardVariants}
            custom={index}
            className={`flex flex-col border rounded-2xl p-6 bg-white shadow-sm h-full relative w-80 transition-transform ${
              plan.isPopular ? " scale-105 z-20" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-sm">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-600">/mo</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {plan.description}
              </p>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <HugeiconsIcon
                  icon={FlashFreeIcons}
                  className="w-5 h-5 text-orange-500 fill-orange-500"
                />
                <span>{plan.credits}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Approx. {plan.conversations}
              </p>
            </div>

            <ul className="mt-6 flex flex-col gap-3 text-xs font-medium">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <HugeiconsIcon
                    icon={Tick02FreeIcons}
                    className="w-4 h-4 text-blue-600 shrink-0 mt-0.5"
                  />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={
                plan.isCurrentPlan
                  ? "outline"
                  : plan.isPopular
                    ? "default"
                    : "outline"
              }
              className={`mt-8 w-full rounded-lg ${
                plan.isPopular
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : plan.isCurrentPlan
                    ? "border-gray-300 text-gray-700"
                    : "border-gray-300 hover:border-gray-400"
              }`}
              size="lg"
              disabled={plan.isCurrentPlan}
            >
              {plan.buttonLabel}
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Enterprise Section */}
      <motion.div
        variants={textVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOptions}
        custom={2}
        className="w-full max-w-6xl mt-6"
      >
        <div className="bg-slate-900 rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Need Enterprise Customization?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-tight text-sm font-medium">
            For large organizations with high volume needs, custom integrations,
            and SLA guarantees.
          </p>
          <Button
            variant="outline"
            className="bg-white text-slate-900 hover:bg-gray-100 rounded-lg px-8"
            size="lg"
          >
            Contact Enterprise Sales
          </Button>
        </div>
      </motion.div>
    </section>
  );
};
