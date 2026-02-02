"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChartLineData01Icon,
  Activity01Icon,
  User02Icon,
  Pen01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

export default function InsightsAnalyticsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm Link, your business intelligence agent. I monitor all conversations across your agents and customers.\n\nAsk me anything about your performance, customer sentiment, or agent efficiency.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getDemoResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("sentiment")) {
      return "Based on the latest analysis, customer sentiment is predominantly positive at 87%. We've seen a 12% improvement over the last month, with customers particularly appreciating the quick response times and helpful interactions from your Sales Assistant and Support Bot.";
    } else if (
      lowerMessage.includes("agent") ||
      lowerMessage.includes("perform")
    ) {
      return "Your top performing agent is the Sales Assistant with a 92% success rate. It's handling an average of 145 conversations per day with an impressive 98% customer satisfaction score. Consider scaling this agent's capacity to handle more traffic.";
    } else if (
      lowerMessage.includes("topic") ||
      lowerMessage.includes("common")
    ) {
      return "The most common topics this week are: Product inquiries (34%), Pricing questions (28%), Technical support (21%), and Booking requests (17%). Your agents are handling these efficiently with an average resolution time of 4.2 minutes.";
    } else if (lowerMessage.includes("improve")) {
      return "I recommend focusing on three areas: 1) Reducing response time for the Customer Service agent (currently at 2m 15s), 2) Improving the Analytics Agent's success rate by providing more training data, and 3) Implementing automated follow-ups for unresolved conversations.";
    } else if (lowerMessage.includes("trend")) {
      return "Your business is trending positively! Conversation volume is up 23% month-over-month, success rates have improved by 8%, and customer satisfaction scores have reached an all-time high of 4.8/5.0. Keep up the excellent work!";
    } else {
      return "That's an interesting question! Based on your current metrics, everything is running smoothly. Your agents are handling an average of 2,405 interactions with a 4.8/5.0 satisfaction rate. Would you like me to dive deeper into any specific area?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise((resolve) =>
      setTimeout(resolve, 1500 + Math.random() * 1000),
    );

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: getDemoResponse(inputValue),
      sender: "ai",
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiResponse]);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const metrics = [
    {
      label: "SATISFACTION",
      value: "4.8/5.0",
      icon: <HugeiconsIcon icon={ChartLineData01Icon} />,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "RESPONSE TIME",
      value: "1m 24s",
      icon: <HugeiconsIcon icon={Activity01Icon} />,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "TOTAL INTERACTIONS",
      value: "2,405",
      icon: <HugeiconsIcon icon={User02Icon} />,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  const agentPerformance = [
    {
      name: "Sales Assistant",
      percentage: 92,
    },
    {
      name: "Support Bot",
      percentage: 85,
    },
    {
      name: "Booking Manager",
      percentage: 78,
    },
    {
      name: "Customer Service",
      percentage: 72,
    },
    {
      name: "Marketing Agent",
      percentage: 65,
    },
    {
      name: "Analytics Agent",
      percentage: 58,
    },
  ];

  const suggestedQuestions = [
    "How is sentiment trending?",
    "Which agent performs best?",
    "What are common topics?",
  ];

  return (
    <div className="flex h-full rounded-r-xl bg-linear-to-br from-gray-50/50 to-gray-100/50 backdrop-blur-xl">
      {/* Left Sidebar - AI Chat Interface with macOS design */}
      <motion.div
        className="w-1/4 bg-card/80 backdrop-blur-xl rounded-l-2xl border-r border-border/50 flex flex-col shadow-xl"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* macOS Window Controls */}
        <div className="flex items-center gap-2 p-4 border-b border-border/50">
          <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
        </div>

        {/* Chat Header */}
        <div className="p-6 border-b border-border/50">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
            >
              <HugeiconsIcon
                icon={SparklesIcon}
                className="w-6 h-6 text-white"
              />
            </motion.div>
            <div>
              <h3 className="font-semibold text-foreground">Link AI</h3>
              <div className="flex items-center gap-1.5">
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex gap-3"
              >
                {message.sender === "ai" && (
                  <motion.div
                    className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <HugeiconsIcon
                      icon={SparklesIcon}
                      className="w-4 h-4 text-blue-600 dark:text-blue-400"
                    />
                  </motion.div>
                )}
                <div
                  className={`flex-1 ${
                    message.sender === "user" ? "flex justify-end" : ""
                  }`}
                >
                  <motion.div
                    className={`${
                      message.sender === "ai"
                        ? "bg-muted/50 backdrop-blur-sm text-foreground"
                        : "bg-linear-to-br from-blue-500 to-blue-600 text-white ml-auto"
                    } rounded-2xl p-4 text-sm leading-relaxed max-w-[85%] shadow-sm`}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    {message.content}
                  </motion.div>
                </div>
                {/* {message.sender === "user" && (
                  <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 text-white font-semibold text-sm"></div>
                )} */}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
                <HugeiconsIcon
                  icon={SparklesIcon}
                  className="w-4 h-4 text-blue-600 dark:text-blue-400"
                />
              </div>
              <div className="bg-muted/50 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
                <motion.div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-blue-600 rounded-full"
                      animate={{
                        y: [0, -8, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-6 border-t border-border/50 bg-card/50 backdrop-blur-xl">
          <div className="mb-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs px-3 py-2 bg-muted/50 hover:bg-muted border border-border/50 rounded-full text-muted-foreground hover:text-foreground transition-all whitespace-nowrap backdrop-blur-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Ask about sentiment, agents, or topics..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
              className="w-full px-4 py-3 pr-12 bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
            />
            <motion.button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HugeiconsIcon icon={Pen01Icon} className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Right Content Area */}
      <div className="flex flex-col w-full gap-6 p-6">
        {/* Metrics Cards with macOS style */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring" as const,
                    stiffness: 100,
                    damping: 15,
                  },
                },
              }}
              whileHover={{
                scale: 1.03,
                y: -4,
                transition: { duration: 0.2 },
              }}
              className="bg-card/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-border/50 cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-3">
                    {metric.label}
                  </p>
                  <motion.p
                    className="text-3xl font-bold bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    {metric.value}
                  </motion.p>
                </div>
                <motion.div
                  className={`${metric.bgColor} ${metric.iconColor} p-3 rounded-2xl shadow-md`}
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  {metric.icon}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Business Overview with macOS style */}
        <motion.div
          className="flex-1 overflow-hidden rounded-2xl p-8 shadow-xl border border-border/50 bg-card/80 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* macOS Window Controls */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
          </div>

          <div className="flex items-start justify-between mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <HugeiconsIcon
                    icon={ChartLineData01Icon}
                    className="w-5 h-5 text-primary"
                  />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Business Overview
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                General health metrics of your AI fleet.
              </p>
            </motion.div>
            <motion.span
              className="text-xs font-medium text-muted-foreground bg-muted/50 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-border/50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.span
                className="size-2 bg-green-500 rounded-full shadow-lg shadow-green-500/50"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.6, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              Live Data
            </motion.span>
          </div>

          {/* Agent Performance Bars with enhanced macOS style */}
          <motion.div
            className="space-y-6 overflow-y-auto h-full px-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {agentPerformance.map((agent, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      type: "spring" as const,
                      stiffness: 100,
                      damping: 15,
                    },
                  },
                }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-44">
                    <span className="text-sm font-semibold text-foreground">
                      {agent.name}
                    </span>
                  </div>
                  <div className="flex-1 relative">
                    {/* Background bar with glassmorphism */}
                    <div className="h-14 bg-muted/30 backdrop-blur-sm rounded-2xl overflow-hidden relative shadow-inner border border-border/30">
                      {/* Animated gradient bar */}
                      <motion.div
                        className={`h-full bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 text-white rounded-2xl relative overflow-hidden shadow-lg`}
                        initial={{ width: 0 }}
                        animate={{ width: `${agent.percentage}%` }}
                        transition={{
                          duration: 1.5,
                          delay: index * 0.15,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      >
                        {/* Shine effect */}
                        <motion.div
                          className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                          animate={{
                            x: ["-100%", "200%"],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            repeatDelay: 4,
                            ease: "easeInOut",
                          }}
                        />

                        {/* Subtle gradient overlay for depth */}
                        <div className="absolute inset-0 bg-linear-to-t from-blue-900/20 to-transparent" />
                      </motion.div>

                      {/* Percentage label inside bar */}
                      <div className="absolute inset-0 flex items-center justify-end pr-5">
                        <motion.span
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: index * 0.15 + 1,
                            duration: 0.3,
                            type: "spring",
                          }}
                          className="text-base font-bold text-gray-300 drop-shadow-lg"
                        >
                          {agent.percentage}%
                        </motion.span>
                      </div>
                    </div>
                  </div>

                  {/* Status indicator with enhanced styling */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: index * 0.15 + 1.2,
                      type: "spring" as const,
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.1 }}
                    className={`bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md border border-border/20 backdrop-blur-sm`}
                  >
                    <HugeiconsIcon
                      icon={ChartLineData01Icon}
                      className="size-3.5"
                    />
                    Active
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
