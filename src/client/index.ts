import { registerEvents } from "../utils";
import { Client, GatewayIntentBits } from "discord.js";
import events from "../events";
import Keys from "../keys";
import dbConnect from "./db";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});


registerEvents(client, events);

try {
  client.login(Keys.clientToken);
  dbConnect();
} catch (error) {
  console.log("Logiging error " + error);
  process.exit();
}
