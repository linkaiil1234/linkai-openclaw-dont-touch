import React from "react";

// Instagram SVG path for mask
const INSTAGRAM_SVG_PATH =
  "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9c63.6 0 114.9-51.3 114.9-114.9s-51.3-114.9-114.9-114.9zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z";

const INSTAGRAM_SVG_MASK_URL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath fill='black' d='${INSTAGRAM_SVG_PATH}'/%3E%3C/svg%3E")`;

// Instagram gradient colors
export const INSTAGRAM_GRADIENT_FROM = "#833AB4";
export const INSTAGRAM_GRADIENT_TO = "#E1306C";

// Instagram icon gradient styles
export const INSTAGRAM_ICON_GRADIENT_STYLES: React.CSSProperties = {
  WebkitMaskImage: INSTAGRAM_SVG_MASK_URL,
  maskImage: INSTAGRAM_SVG_MASK_URL,
  maskSize: "contain",
  maskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
};

// Instagram icon gradient className
export const INSTAGRAM_ICON_GRADIENT_CLASSNAME =
  "bg-linear-to-br from-[#833AB4] to-[#E1306C]";

// Reusable Instagram Icon Component with Gradient
interface InstagramIconProps {
  className?: string;
  size?: number | string;
}

export const InstagramIconGradient: React.FC<InstagramIconProps> = ({
  className,
  size,
}) => {
  // Handle size prop - if it's a number, use inline styles
  const sizeStyle: React.CSSProperties =
    typeof size === "number" ? { width: `${size}px`, height: `${size}px` } : {};

  // Use className if provided, otherwise use size prop or default
  const sizeClass = className || (typeof size === "string" ? size : "size-4");

  return (
    <span
      className={`inline-block ${sizeClass} ${INSTAGRAM_ICON_GRADIENT_CLASSNAME}`}
      style={{ ...INSTAGRAM_ICON_GRADIENT_STYLES, ...sizeStyle }}
    />
  );
};

// Helper function to get Instagram icon with gradient
export const getInstagramIconGradient = (
  className?: string,
  size?: number | string,
) => {
  return <InstagramIconGradient className={className} size={size} />;
};
