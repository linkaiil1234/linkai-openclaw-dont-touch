// Channel-specific styling
export const getContainerStyle = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return "bg-[#F0F2F5] dark:bg-[#1F2C33] border-t border-[#E9EDEF] dark:border-[#2A3942]";
    case "instagram":
      return "bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800";
    case "sms":
      return "bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800";
    case "telegram":
      return "bg-[#E5EBF1] dark:bg-[#212121] border-t border-gray-300 dark:border-gray-700";
    case "email":
    default:
      return "bg-gradient-to-t from-blue-50/50 via-white to-transparent dark:from-gray-900 dark:via-gray-800 backdrop-blur-lg border-t border-blue-100/50 dark:border-blue-900/30";
  }
};

export const getInputStyle = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return "bg-white dark:bg-[#2A3942] border-none shadow-sm hover:shadow-md";
    case "instagram":
      return "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600";
    case "sms":
      return "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700";
    case "telegram":
      return "bg-white dark:bg-[#2B2B2B] border-none shadow-sm hover:shadow-md";
    case "email":
    default:
      return "bg-white dark:bg-gray-800 border-2 border-blue-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-gray-600 shadow-md";
  }
};

export const getAttachmentButtonStyle = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return "hover:bg-[#00A884]/10 text-[#00A884] hover:text-[#00A884]";
    case "instagram":
      return "hover:bg-gradient-to-br hover:from-[#833AB4]/10 hover:to-[#E1306C]/10 text-[#E1306C] hover:text-[#E1306C]";
    case "sms":
      return "hover:bg-[#007AFF]/10 text-[#007AFF] hover:text-[#007AFF]";
    case "telegram":
      return "hover:bg-[#0088CC]/10 text-[#0088CC] hover:text-[#0088CC]";
    case "email":
    default:
      return "hover:bg-primary/10 text-primary hover:text-primary";
  }
};

export const getSendButtonStyle = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return "bg-[#00A884] hover:bg-[#008F72] text-white";
    case "instagram":
      return "bg-gradient-to-br from-[#833AB4] to-[#E1306C] hover:from-[#7232A8] hover:to-[#C72A5C] text-white";
    case "sms":
      return "bg-[#007AFF] hover:bg-[#0051D5] text-white";
    case "telegram":
      return "bg-[#0088CC] hover:bg-[#006BA3] text-white";
    case "email":
    default:
      return "bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white";
  }
};
