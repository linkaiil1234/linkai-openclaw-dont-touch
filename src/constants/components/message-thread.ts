// Channel-specific background styles
export const getBackgroundStyle = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return "bg-[#ECE5DD] dark:bg-[#0B141A]";
    case "instagram":
      return "bg-white dark:bg-black";
    case "sms":
      return "bg-gray-100 dark:bg-[#1E293B]";
    case "telegram":
      return "bg-[#E5EBF1] dark:bg-[#212121]";
    case "email":
    default:
      return "bg-[#F5F7FA] dark:bg-[#1E293B]";
  }
};

// Channel-specific header styles
export const getHeaderStyle = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return "bg-[#008069] dark:bg-[#1F2C33] border-none";
    case "instagram":
      return "bg-background dark:bg-black border-b border-gray-200 dark:border-gray-800";
    case "sms":
      return "bg-gray-100/95 dark:bg-[#1E293B]/95 backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-700/30";
    case "telegram":
      return "bg-[#517DA2] dark:bg-[#2B2B2B] border-none";
    case "email":
    default:
      return "bg-white dark:bg-[#202124] border-b border-gray-200 dark:border-gray-700";
  }
};

// Get channel icon
//   export const getChannelIcon = (channel: string) => {
//     switch (channel) {
//       case "whatsapp":
//         return <IoLogoWhatsapp className="w-2 h-2" />;
//       case "email":
//         return (
//           <Image
//             src={GmailIcon}
//             alt="Gmail"
//             width={8}
//             height={8}
//             className="w-2 h-2"
//           />
//         );
//       case "sms":
//         return <MdSms className="w-2 h-2" />;
//       case "instagram":
//         return <FaInstagramSquare className="w-2 h-2" />;
//       case "telegram":
//         return (
//           <svg
//             className="w-2 h-2"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.87 8.81c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
//           </svg>
//         );
//       default:
//         return (
//           <Image
//             src={GmailIcon}
//             alt="Gmail"
//             width={8}
//             height={8}
//             className="w-2 h-2"
//           />
//         );
//     }
//   };

// Get channel icon colors
export const getChannelIconStyle = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return "bg-[#25D366] text-white border-white";
    case "email":
      return "bg-gray-100 text-white border-white";
    case "sms":
      return "bg-black text-white border-white ";
    case "instagram":
      return "bg-linear-to-br from-[#833AB4] to-[#E1306C] text-white border-white";
    case "telegram":
      return "bg-[#0088CC] text-white border-white";
    default:
      return "bg-[#fff] text-white border-white";
  }
};

// Channel-specific message bubble styles

export const getIncomingMessageStyle = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return "bg-[#D9FDD3] dark:bg-[#005C4B] text-gray-900 dark:text-white shadow-sm border-none ";
    case "instagram":
      return "bg-linear-to-br from-[#833AB4] via-[#C13584] to-[#E1306C] text-white shadow-lg border-none ";
    case "sms":
      return "bg-[#007AFF] dark:bg-[#0A84FF] text-white shadow-sm";
    case "telegram":
      return "bg-[#E7F3FF] dark:bg-[#3390EC] text-gray-900 dark:text-white shadow-sm border-none ";
    case "email":
    default:
      return "bg-[#1A73E8] dark:bg-[#4285F4] text-white shadow-sm border-none ";
  }
};

export const getOutgoingMessageStyle = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return "bg-white dark:bg-[#1F2C33] text-gray-900 dark:text-white shadow-sm border-none";
    case "instagram":
      return "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800";
    case "sms":
      return "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm";
    case "telegram":
      return "bg-white dark:bg-[#2B2B2B] text-gray-900 dark:text-white shadow-sm border-none";
    case "email":
    default:
      return "bg-[#F1F3F4] dark:bg-[#2D2E30] text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700";
  }
};

export const getBubbleRadius = (channel: string, isIncoming: boolean) => {
  switch (channel) {
    case "whatsapp":
      return isIncoming
        ? "rounded-lg rounded-tl-sm"
        : "rounded-lg rounded-tr-sm";
    case "instagram":
      return "rounded-lg";
    case "sms":
      return "rounded-[18px]";
    case "telegram":
      return isIncoming
        ? "rounded-lg rounded-tl-sm"
        : "rounded-lg rounded-tr-sm";
    case "email":
    default:
      return isIncoming
        ? "rounded-lg rounded-tl-sm"
        : "rounded-lg rounded-tr-sm";
  }
};
