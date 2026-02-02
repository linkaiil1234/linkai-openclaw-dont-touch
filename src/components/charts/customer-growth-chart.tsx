"use client";

import { useEffect, useState } from "react";
import {
  ChartLineData01Icon,
  User02Icon,
  Activity01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const data = [
  { month: "Jan", customers: 45, revenue: 12500 },
  { month: "Feb", customers: 52, revenue: 14200 },
  { month: "Mar", customers: 61, revenue: 18900 },
  { month: "Apr", customers: 58, revenue: 17100 },
  { month: "May", customers: 70, revenue: 21400 },
  { month: "Jun", customers: 85, revenue: 26800 },
];

export function CustomerGrowthChart() {
  const [isVisible, setIsVisible] = useState(false);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const maxValue = Math.max(...data.map((d) => d.customers));
  const minValue = Math.min(...data.map((d) => d.customers));
  const chartWidth = 280;
  const chartHeight = 140;
  const padding = 20;

  // Calculate points for the line
  const points = data.map((item, index) => {
    const x =
      (index / (data.length - 1)) * (chartWidth - padding * 2) + padding;
    const y =
      chartHeight -
      ((item.customers - minValue) / (maxValue - minValue)) *
        (chartHeight - padding * 2) -
      padding;
    return { x, y, ...item };
  });

  // Create SVG path for line
  const linePath = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prevPoint = points[index - 1];
    const cpX1 = prevPoint.x + (point.x - prevPoint.x) / 3;
    const cpY1 = prevPoint.y;
    const cpX2 = prevPoint.x + (2 * (point.x - prevPoint.x)) / 3;
    const cpY2 = point.y;
    return `${path} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${point.x} ${point.y}`;
  }, "");

  // Create area path
  const areaPath = `${linePath} L ${
    chartWidth - padding
  } ${chartHeight} L ${padding} ${chartHeight} Z`;

  return (
    <div className="w-full h-full flex flex-col justify-between p-4">
      {/* Header with stats */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <HugeiconsIcon icon={Activity01Icon} className="w-3 h-3" />
            Customer Analytics
          </h4>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            6-month performance
          </p>
        </div>
        <div className="flex items-center gap-1 bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">
          <HugeiconsIcon icon={ChartLineData01Icon} className="w-3 h-3" />
          <span className="text-[10px] font-bold">+21%</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative flex-1 flex items-center justify-center">
        <svg
          width={chartWidth}
          height={chartHeight}
          className="overflow-visible"
          onLoad={(e) => {
            const path = e.currentTarget.querySelector(
              ".line-path",
            ) as SVGPathElement;
            if (path) setPathLength(path.getTotalLength());
          }}
        >
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i * (chartHeight - padding * 2)) / 4}
              x2={chartWidth - padding}
              y2={padding + (i * (chartHeight - padding * 2)) / 4}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border opacity-30"
            />
          ))}

          {/* Area gradient */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(var(--primary))"
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--primary))"
                stopOpacity="0.05"
              />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#areaGradient)"
            opacity={isVisible ? 1 : 0}
            style={{
              transition: "opacity 0.8s ease-out 0.2s",
            }}
          />

          {/* Line */}
          <path
            className="line-path"
            d={linePath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLength}
            strokeDashoffset={isVisible ? 0 : pathLength}
            style={{
              transition: "stroke-dashoffset 1.5s ease-out 0.3s",
            }}
          />

          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="hsl(var(--background))"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                opacity={isVisible ? 1 : 0}
                style={{
                  transition: `opacity 0.3s ease-out ${0.5 + index * 0.1}s`,
                }}
                className="cursor-pointer hover:r-5 transition-all"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                fill="hsl(var(--primary))"
                opacity="0"
                className="hover:opacity-20 transition-opacity cursor-pointer"
              />
              {/* Month labels */}
              <text
                x={point.x}
                y={chartHeight - 5}
                textAnchor="middle"
                className="text-[9px] fill-muted-foreground font-medium"
                opacity={isVisible ? 1 : 0}
                style={{
                  transition: `opacity 0.3s ease-out ${0.7 + index * 0.1}s`,
                }}
              >
                {point.month}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-muted-foreground mb-1">
            <HugeiconsIcon icon={User02Icon} className="w-3 h-3" />
            <span className="text-[9px]">Total</span>
          </div>
          <span className="text-sm font-bold text-foreground">371</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-muted-foreground mb-1">Peak</span>
          <span className="text-sm font-bold text-foreground">85</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-muted-foreground mb-1">
            Avg Growth
          </span>
          <span className="text-sm font-bold text-green-600">+8.9%</span>
        </div>
      </div>
    </div>
  );
}
