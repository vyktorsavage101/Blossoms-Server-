import "dotenv/config";

function required(name) {
  const value = process.env[name]?.trim();

  if (!value || value.startsWith("YOUR_")) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function optional(name, fallback = "") {
  return process.env[name]?.trim() || fallback;
}

const config = {
  token: required("TOKEN"),
  clientId: required("CLIENT_ID"),
  guildId: required("GUILD_ID"),

  channels: {
    welcome: required("WELCOME_CHANNEL_ID"),
    verification: required("VERIFICATION_CHANNEL_ID"),
    rules: required("RULES_CHANNEL_ID"),
    roleSelect: required("ROLE_SELECT_CHANNEL_ID"),
    ticketCategory: required("TICKET_CATEGORY_ID"),
    staffLog: optional("STAFF_LOG_CHANNEL_ID"),
  },

  roles: {
    unverified: required("UNVERIFIED_ROLE_ID"),
    communityMember: required("COMMUNITY_MEMBER_ROLE_ID"),
    denied: required("DENIED_ROLE_ID"),
    verificationStaff: required("VERIFICATION_STAFF_ROLE_ID"),
  },

  roleOptions: [
    ["ROLE_1_ID", "ROLE_1_NAME"],
    ["ROLE_2_ID", "ROLE_2_NAME"],
    ["ROLE_3_ID", "ROLE_3_NAME"],
    ["ROLE_4_ID", "ROLE_4_NAME"],
    ["ROLE_5_ID", "ROLE_5_NAME"],
  ]
    .map(([idKey, nameKey]) => ({
      id: optional(idKey),
      name: optional(nameKey),
    }))
    .filter(
      (role) =>
        role.id &&
        role.name &&
        !role.id.startsWith("YOUR_") &&
        !role.name.startsWith("YOUR_")
    ),

  links: {
    rules: optional("RULES_URL"),
    marketplace: optional("MARKETPLACE_URL"),
  },

  banners: {
    welcome: optional("WELCOME_BANNER_URL"),
    rules: optional("RULES_BANNER_URL"),
    verification: optional("VERIFICATION_BANNER_URL"),
  },

  serverName: optional("SERVER_NAME", "Blossoms"),
  accentColor: Number.parseInt(optional("ACCENT_COLOR", "FF3700"), 16),
};

export default config;
