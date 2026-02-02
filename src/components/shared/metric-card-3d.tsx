"use client";

import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { ReactNode } from "react";

interface MetricCard3DProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  badge?: ReactNode;
  iconBgColor?: string;
}

export const MetricCard3D = ({
  label,
  value,
  icon,
  badge,
  iconBgColor = "bg-gray-100 dark:bg-gray-800",
}: MetricCard3DProps) => {
  return (
    <CardContainer className="w-full h-[168px]">
      <CardBody className="w-full h-full">
        <CardItem translateZ="50" className="w-full h-full">
          <div className="rounded-2xl w-full border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 h-[168px]">
            <CardItem translateZ="100">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl ${iconBgColor}`}
              >
                {icon}
              </div>
            </CardItem>

            <div className="flex items-end justify-between mt-2">
              <CardItem translateZ="60" className="flex-1">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {label}
                  </span>
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 text-3xl">
                    {value}
                  </h4>
                </div>
              </CardItem>

              {badge && <CardItem translateZ="80">{badge}</CardItem>}
            </div>
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
};
