const GRAPH_VERSION = process.env.NEXT_PUBLIC_META_GRAPH_VERSION ?? "v24.0";
const META_APP_ID = process.env.NEXT_PUBLIC_META_APP_ID!;
const META_WA_CONFIG_ID = process.env.NEXT_PUBLIC_META_WA_CONFIG_ID!;
const META_IG_CONFIG_ID = process.env.NEXT_PUBLIC_META_IG_CONFIG_ID!;

export type MetaStatePayload = {
  userId: string;
  agentId: string;
  returnTo?: string | null;
};

export const buildState = (payload: MetaStatePayload) =>
  Buffer.from(JSON.stringify(payload)).toString("base64");

export const buildWhatsAppOAuthUrl = (state: MetaStatePayload) => {
  const redirectUri = encodeURIComponent(
    process.env.NEXT_PUBLIC_META_WA_REDIRECT_URI!,
  );

  return (
    `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth?` +
    `client_id=${META_APP_ID}` +
    `&redirect_uri=${redirectUri}` +
    `&state=${buildState(state)}` +
    `&response_type=code` +
    `&config_id=${META_WA_CONFIG_ID}`
  );
};

export const buildInstagramOAuthUrl = (state: MetaStatePayload) => {
  const redirectUri = encodeURIComponent(
    process.env.NEXT_PUBLIC_META_IG_REDIRECT_URI!,
  );

  return (
    `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth?` +
    `client_id=${META_APP_ID}` +
    `&redirect_uri=${redirectUri}` +
    `&state=${buildState(state)}` +
    `&response_type=code` +
    `&config_id=${META_IG_CONFIG_ID}`
  );
};
