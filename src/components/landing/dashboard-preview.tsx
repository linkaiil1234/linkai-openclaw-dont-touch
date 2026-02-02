"use client";

import { Bot, Users } from "lucide-react";
import { DashboardBrowserHeader } from "./dashboard-browser-header";
import { FaMoneyCheckAlt } from "react-icons/fa";

export const DashboardPreview = () => {
  return (
    <>
      <DashboardBrowserHeader />

      <div className="bg-linear-to-br from-neutral-50 via-white to-neutral-50 p-4 md:p-6">
        {/* First Row: EcommerceMetrics + MonthlySalesChart | MonthlyTarget */}
        <div className="flex flex-col xl:flex-row gap-4 mb-4">
          {/* Left Column: 58.333% */}
          <div className="flex flex-col xl:w-[58.333%] gap-4">
            {/* EcommerceMetrics - Two Cards */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Money Saved Card */}
              <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl">
                  <FaMoneyCheckAlt className="text-gray-800 w-5 h-5" />
                </div>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <span className="text-xs text-gray-500 font-medium">
                      Money Saved
                    </span>
                    <h4 className="mt-1 font-bold text-gray-800 text-2xl">
                      96%
                    </h4>
                  </div>
                  <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                    >
                      <path
                        d="M6 3L6 9M6 3L8 5M6 3L4 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                    12.5%
                  </div>
                </div>
              </div>

              {/* Customers Engaged Card */}
              <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl">
                  <Users className="text-gray-800 w-5 h-5" />
                </div>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <span className="text-xs text-gray-500 font-medium">
                      Customers Engaged
                    </span>
                    <h4 className="mt-1 font-bold text-gray-800 text-2xl">
                      4,567
                    </h4>
                  </div>
                  <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                    >
                      <path
                        d="M6 3L6 9M6 3L8 5M6 3L4 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                    68%
                  </div>
                </div>
              </div>
            </div>

            {/* MonthlySalesChart - Bar Chart */}
            <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-800">
                  Daily Conversations
                </h3>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 text-xs font-medium text-gray-700 border border-gray-300 rounded-md">
                    Week
                  </button>
                </div>
              </div>
              <div className="flex items-end gap-2 h-28">
                {[
                  { day: "Mon 5", height: 45 },
                  { day: "Tue 6", height: 60 },
                  { day: "Wed 7", height: 55 },
                  { day: "Thu 8", height: 75 },
                  { day: "Fri 9", height: 65 },
                  { day: "Sat 10", height: 85 },
                  { day: "Sun 11", height: 70 },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div className="w-full relative group">
                      <div
                        className="w-full bg-[#465fff] rounded-t-md transition-all"
                        style={{ height: `${item.height}px` }}
                      />
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {Math.floor(item.height * 2)} msgs
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 text-center">
                      {item.day.split(" ")[0].substring(0, 3)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Total Messages</span>
                  <span className="font-semibold text-gray-800">455</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 41.666% - MonthlyTarget (Satisfaction Rate) */}
          <div className="flex-1 xl:w-[41.666%]">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm h-full">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Satisfaction Rate
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Your satisfaction rate with the product and services
                  </p>
                </div>
              </div>

              {/* Radial Progress Chart */}
              <div className="relative flex items-center justify-center py-4">
                <svg viewBox="0 0 200 110" className="w-full max-w-[280px]">
                  {/* Background Arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Progress Arc (98.65%) */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 165 52"
                    fill="none"
                    stroke="#475FFF"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Center Text */}
                  <text
                    x="100"
                    y="70"
                    textAnchor="middle"
                    className="text-2xl font-bold fill-[#475FFF]"
                  >
                    98.65%
                  </text>
                  <foreignObject x="75" y="75" width="50" height="20">
                    <div className="flex items-center justify-center">
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                        +10%
                      </span>
                    </div>
                  </foreignObject>
                </svg>
              </div>

              <p className="mx-auto mt-2 w-full text-center text-xs text-gray-500 leading-relaxed">
                Your satisfaction rate is 98.65%, it&apos;s higher than last
                month. Keep up your good work!
              </p>

              {/* Stats Row */}
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    Prev Month
                  </p>
                  <p className="text-sm font-bold text-gray-800 flex items-center justify-center gap-1">
                    00.00%
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.26816 13.6632L7.8311 13.9176L8.36339 13.6981L12.3635 9.70076L11.3032 8.63973L8.5811 11.36L8.5811 2.5L7.0811 2.5L7.0811 11.3556L4.36354 8.63975L3.30321 9.70075L7.26816 13.6632Z"
                        fill="#D92D20"
                      />
                    </svg>
                  </p>
                </div>

                <div className="w-px bg-gray-200 h-8"></div>

                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    Target
                  </p>
                  <p className="text-sm font-bold text-gray-800">00.00%</p>
                </div>

                <div className="w-px bg-gray-200 h-8"></div>

                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    Today
                  </p>
                  <p className="text-sm font-bold text-gray-800 flex items-center justify-center gap-1">
                    00.00%
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.60141 2.33683L8.16435 2.08243L8.69664 2.30191L12.6968 6.29924L11.6365 7.36027L8.91435 4.64004L8.91435 13.5L7.41435 13.5L7.41435 4.64442L4.69679 7.36025L3.63646 6.29926L7.60141 2.33683Z"
                        fill="#039855"
                      />
                    </svg>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row: StatisticsChart (Full Width) */}
        <div className="w-full mb-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  Agent Statistics
                </h3>
                <p className="text-xs text-gray-500">
                  Conversations and messages handled by your agents
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
                  <button className="px-2 py-1 text-xs font-medium rounded-md bg-gray-900 text-white">
                    Monthly
                  </button>
                  <button className="px-2 py-1 text-xs font-medium text-gray-600">
                    Quarterly
                  </button>
                </div>
              </div>
            </div>

            {/* Area Chart */}
            <div className="relative h-40">
              <svg
                viewBox="0 0 600 160"
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                {/* Grid Lines */}
                <line
                  x1="0"
                  y1="40"
                  x2="600"
                  y2="40"
                  stroke="#E5E7EB"
                  strokeDasharray="3 3"
                />
                <line
                  x1="0"
                  y1="80"
                  x2="600"
                  y2="80"
                  stroke="#E5E7EB"
                  strokeDasharray="3 3"
                />
                <line
                  x1="0"
                  y1="120"
                  x2="600"
                  y2="120"
                  stroke="#E5E7EB"
                  strokeDasharray="3 3"
                />

                {/* Conversations Area (Blue) */}
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#465FFF" stopOpacity="0.5" />
                    <stop
                      offset="100%"
                      stopColor="#465FFF"
                      stopOpacity="0.05"
                    />
                  </linearGradient>
                  <linearGradient
                    id="lightBlueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#9CB9FF" stopOpacity="0.5" />
                    <stop
                      offset="100%"
                      stopColor="#9CB9FF"
                      stopOpacity="0.05"
                    />
                  </linearGradient>
                </defs>

                {/* Conversations Line & Area */}
                <path
                  d="M 0 90 L 55 75 L 110 85 L 165 95 L 220 70 L 275 80 L 330 65 L 385 45 L 440 35 L 495 30 L 550 20 L 600 25"
                  fill="url(#blueGradient)"
                  stroke="none"
                />
                <path
                  d="M 0 90 L 55 75 L 110 85 L 165 95 L 220 70 L 275 80 L 330 65 L 385 45 L 440 35 L 495 30 L 550 20 L 600 25 L 600 160 L 0 160 Z"
                  fill="url(#blueGradient)"
                />
                <path
                  d="M 0 90 L 55 75 L 110 85 L 165 95 L 220 70 L 275 80 L 330 65 L 385 45 L 440 35 L 495 30 L 550 20 L 600 25"
                  fill="none"
                  stroke="#465FFF"
                  strokeWidth="2"
                />

                {/* Messages Line & Area */}
                <path
                  d="M 0 130 L 55 128 L 110 120 L 165 115 L 220 118 L 275 110 L 330 95 L 385 75 L 440 60 L 495 50 L 550 40 L 600 35"
                  fill="url(#lightBlueGradient)"
                  stroke="none"
                />
                <path
                  d="M 0 130 L 55 128 L 110 120 L 165 115 L 220 118 L 275 110 L 330 95 L 385 75 L 440 60 L 495 50 L 550 40 L 600 35 L 600 160 L 0 160 Z"
                  fill="url(#lightBlueGradient)"
                />
                <path
                  d="M 0 130 L 55 128 L 110 120 L 165 115 L 220 118 L 275 110 L 330 95 L 385 75 L 440 60 L 495 50 L 550 40 L 600 35"
                  fill="none"
                  stroke="#9CB9FF"
                  strokeWidth="2"
                />
              </svg>

              {/* X-axis labels */}
              <div className="flex justify-between mt-2 px-2">
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                ].map((month, i) => (
                  <span key={i} className="text-[10px] text-gray-500">
                    {month}
                  </span>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#465FFF]"></div>
                  <span className="text-xs text-gray-600">Conversations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#9CB9FF]"></div>
                  <span className="text-xs text-gray-600">Messages</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Third Row: Recent Conversations Table */}
        <div className="w-full">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-800">
                Recent Conversations
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-y border-gray-100">
                  <tr>
                    <th className="py-2 text-left text-xs font-medium text-gray-500">
                      Agent
                    </th>
                    <th className="py-2 text-left text-xs font-medium text-gray-500">
                      Channel
                    </th>
                    <th className="py-2 text-left text-xs font-medium text-gray-500">
                      Messages
                    </th>
                    <th className="py-2 text-left text-xs font-medium text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    {
                      name: "Sarah Cohen",
                      channel: "WhatsApp",
                      messages: 24,
                      status: "Active",
                      time: "2m ago",
                    },
                    {
                      name: "Michael Levy",
                      channel: "SMS",
                      messages: 18,
                      status: "Resolved",
                      time: "15m ago",
                    },
                    {
                      name: "Emily David",
                      channel: "Email",
                      messages: 12,
                      status: "Active",
                      time: "1h ago",
                    },
                  ].map((conv, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-md bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                              {conv.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex flex-col items-start">
                            <p className="text-xs font-medium text-gray-800">
                              {conv.name}
                            </p>
                            <span className="text-[10px] text-gray-500">
                              {conv.time}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 text-xs text-gray-600">
                        {conv.channel}
                      </td>
                      <td className="py-2 text-xs text-gray-600">
                        {conv.messages}
                      </td>
                      <td className="py-2">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-md ${
                            conv.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {conv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
