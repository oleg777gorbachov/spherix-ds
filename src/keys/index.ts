interface Keys {
  clientToken: string;
  testGuild: string;
  dbUrl: string;
  twitch_client_id: string;
  twitch_client_secret: string;
  openAi_api_key: string;
  ninja_api_key: string;
  youtube_api_key: string;
}

const Keys: Keys = {
  clientToken: process.env.CLIENT_TOKEN || "null",
  testGuild: process.env.TEST_GUILD || "null",
  dbUrl: process.env.DB_URL || "null",
  twitch_client_id: process.env.TWITCH_CLIENT_ID || "null",
  twitch_client_secret: process.env.TWITCH_SECRET_KEY! || "null",
  openAi_api_key: process.env.OPENAI_API_KEY || "null",
  ninja_api_key: process.env.NINJA_API_KEY || "null",
  youtube_api_key: process.env.YOUTUBE_API_KEY || "null",
};

if (Object.values(Keys).includes("null")) {
  throw new Error("Not all ENV files are defined");
}

export default Keys;
