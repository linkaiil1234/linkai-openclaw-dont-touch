// Channel-specific header background
export const getHeaderBackground = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return "bg-linear-to-b from-[#008069]/20 to-transparent";
    case "email":
      return "bg-linear-to-b from-[#1A89FF]/10 to-transparent";
    case "sms":
      return "bg-linear-to-b from-gray-200/50 to-transparent";
    case "instagram":
      return "bg-linear-to-b from-[#833AB4]/10 to-transparent";
    default:
      return "bg-linear-to-b from-blue-50/50 to-transparent";
  }
};

// Channel-specific avatar ring
export const getAvatarRing = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return "ring-4 ring-white/80 shadow-md hover:ring-[#25D366]/30";
    case "email":
      return "ring-4 ring-white/80 shadow-md hover:ring-[#1A89FF]/30";
    case "sms":
      return "ring-4 ring-white/80 shadow-md hover:ring-gray-400/30";
    case "instagram":
      return "ring-4 ring-white/80 shadow-md hover:ring-[#833AB4]/30";
    default:
      return "ring-4 ring-white/80 shadow-md hover:ring-blue-500/20";
  }
};

// Channel-specific detail fields background
export const getDetailFieldsBg = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return "bg-linear-to-b from-[#008069]/5 to-[#008069]/5 border-[#008069]/10";
    case "email":
      return "bg-linear-to-b from-[#1A89FF]/5 to-[#1A89FF]/5 border-[#1A89FF]/10";
    case "sms":
      return "bg-linear-to-b from-gray-50 to-gray-50/50 border-gray-200";
    case "instagram":
      return "bg-linear-to-b from-[#833AB4]/5 to-[#E1306C]/5 border-[#833AB4]/10";
    default:
      return "bg-linear-to-b from-gray-50 to-gray-50/50 border-gray-100";
  }
};

// Channel-specific tabs background
export const getTabsBg = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return "bg-[#008069]/10 border-[#008069]/20";
    case "email":
      return "bg-[#1A89FF]/10 border-[#1A89FF]/20";
    case "sms":
      return "bg-gray-100/80 border-gray-200/50";
    case "instagram":
      return "bg-[#833AB4]/10 border-[#833AB4]/20";
    default:
      return "bg-gray-100/80 border-gray-200/50";
  }
};

// Channel-specific active tab style
export const getActiveTabStyle = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return "data-[state=active]:bg-[#25D366] data-[state=active]:text-white";
    case "email":
      return "data-[state=active]:bg-[#1A89FF] data-[state=active]:text-white";
    case "sms":
      return "data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900";
    case "instagram":
      return "data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#833AB4] data-[state=active]:to-[#E1306C] data-[state=active]:text-white";
    default:
      return "data-[state=active]:bg-white data-[state=active]:text-gray-900";
  }
};

// Channel-specific separator color
export const getSeparatorColor = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return "bg-[#008069]/20";
    case "email":
      return "bg-[#1A89FF]/20";
    case "sms":
      return "bg-gray-200/50";
    case "instagram":
      return "bg-[#833AB4]/20";
    default:
      return "bg-gray-200/50";
  }
};

// Channel-specific hover background
export const getHoverBg = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return "hover:bg-[#008069]/10";
    case "email":
      return "hover:bg-[#1A89FF]/10";
    case "sms":
      return "hover:bg-gray-50";
    case "instagram":
      return "hover:bg-[#833AB4]/10";
    default:
      return "hover:bg-white/50";
  }
};

// Channel-specific sidebar background
export const getSidebarBg = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return "bg-white/95 dark:bg-[#1F2C33]/95 border-[#008069]/20";
    case "email":
      return "bg-white/95 dark:bg-[#202124]/95 border-[#1A89FF]/20";
    case "sms":
      return "bg-gray-50/95 dark:bg-[#1E293B]/95 border-gray-200/80";
    case "instagram":
      return "bg-white/95 dark:bg-black/95 border-[#833AB4]/20";
    default:
      return "bg-white/95 dark:bg-[#202124]/95 border-gray-200/80";
  }
};
