type TEnv = {
  nodeEnv: string;
  appUrl: string;
  apiUrl: string;
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  firebaseStorageBucket: string;
  firebaseMessagingSenderId: string;
  firebaseAppId: string;

  whatsapp_app_id: string;
  whatsapp_app_secret: string;
  whatsapp_configuration_id: string;
  whatsapp_redirect_uri: string;
};

export const env: TEnv = {
  nodeEnv: process.env.NODE_ENV || "development",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "NA",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "NA",
  firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "NA",
  firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "NA",
  firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "NA",
  firebaseStorageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "NA",
  firebaseMessagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "NA",
  firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "NA",

  whatsapp_app_id: process.env.NEXT_PUBLIC_WHATSAPP_APP_ID || "NA",
  whatsapp_app_secret: process.env.NEXT_PUBLIC_WHATSAPP_APP_SECRET || "NA",
  whatsapp_configuration_id:
    process.env.NEXT_PUBLIC_WHATSAPP_CONFIGURATION_ID || "NA",
  whatsapp_redirect_uri: process.env.NEXT_PUBLIC_WHATSAPP_REDIRECT_URI || "NA",
};
