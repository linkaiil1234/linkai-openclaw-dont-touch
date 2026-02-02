export type TCustomer = {
  contact_id: number;
  channels: TChannelType[];
  name: string;
  email: string | null;
  phone: string | null;
  username: string | null;
  thumbnail: string; // URL or empty string
  language: string | null; // ISO language code (e.g., 'en', 'he')
  last_seen: number; // Unix timestamp
  status: TContactStatus;
  inbox_id?: string;
};
type TContactStatus = "online" | "offline";
type TChannelType = "Whatsapp" | "Instagram" | "Telegram" | "WebWidget";
