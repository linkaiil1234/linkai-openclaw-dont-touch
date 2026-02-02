"use client";

import { useEffect, useState } from "react";

const segments = [
  {
    name: "Active",
    value: 45,
    color: "text-green-600",
    bg: "stroke-green-600",
  },
  { name: "Lead", value: 30, color: "text-blue-600", bg: "stroke-blue-600" },
  {
    name: "Inactive",
    value: 20,
    color: "text-gray-600",
    bg: "stroke-gray-600",
  },
  { name: "Blocked", value: 5, color: "text-red-600", bg: "stroke-red-600" },
];

export function SegmentationChart() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  const cumulativePercent = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="flex items-center gap-6 w-full max-w-md">
        {/* Donut Chart */}
        <div className="relative flex-shrink-0">
          <svg
            width="140"
            height="140"
            viewBox="-1 -1 2 2"
            className="transform -rotate-90"
          >
            {segments.map((segment, index) => {
              const segmentPercent = segment.value / total;
              const [startX, startY] =
                getCoordinatesForPercent(cumulativePercent);
              const newCumulativePercent = cumulativePercent + segmentPercent;
              const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
              const largeArcFlag = segmentPercent > 0.5 ? 1 : 0;

              const pathData = [
                `M ${startX} ${startY}`,
                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `L 0 0`,
              ].join(" ");

              return (
                <path
                  key={segment.name}
                  d={pathData}
                  className={segment.bg}
                  fill="currentColor"
                  opacity={isVisible ? "0.8" : "0"}
                  style={{
                    transition: "opacity 0.8s ease-out",
                    transitionDelay: `${index * 150}ms`,
                  }}
                />
              );
            })}
            {/* Inner circle for donut effect */}
            <circle cx="0" cy="0" r="0.6" fill="hsl(var(--background))" />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground">100%</span>
            <span className="text-[10px] text-muted-foreground">Coverage</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          <h4 className="text-xs font-semibold text-foreground mb-3">
            Customer Segments
          </h4>
          {segments.map((segment, index) => (
            <div
              key={segment.name}
              className="flex items-center justify-between opacity-0 animate-in fade-in slide-in-from-right-4"
              style={{
                animationDelay: `${index * 100 + 400}ms`,
                animationDuration: "500ms",
                animationFillMode: "forwards",
              }}
            >
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${segment.bg.replace(
                    "stroke",
                    "bg",
                  )}`}
                />
                <span className="text-[10px] font-medium text-foreground">
                  {segment.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold ${segment.color}`}>
                  {segment.value}%
                </span>
                <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${segment.bg.replace(
                      "stroke",
                      "bg",
                    )} transition-all duration-1000 ease-out`}
                    style={{
                      width: isVisible ? `${segment.value}%` : "0%",
                      transitionDelay: `${index * 100 + 400}ms`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="pt-3 mt-3 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                Total Segments
              </span>
              <span className="text-xs font-bold text-foreground">4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
