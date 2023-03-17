import { ActionRowBuilder, ButtonBuilder } from "discord.js";
import { CustomId } from ".";

interface helpI {
  command: string;
  desc: string;
}

export function helpDesc(page: number) {
  let desc = ``;
  for (let item of help.slice((page - 1) * 10, page * 10)) {
    desc += `**${item.command}**\n${item.desc}\n`;
  }

  return desc;
}

export function helpMenu(pageParam: number) {
  const first = new ButtonBuilder()
    .setCustomId(CustomId.helpFirst)
    .setLabel("First")
    .setDisabled(pageParam - 1 <= 1)
    .setStyle(3);

  const prev = new ButtonBuilder()
    .setCustomId(CustomId.helpPrev)
    .setLabel("Previous")
    .setDisabled(pageParam - 1 <= 0)
    .setStyle(3);

  const page = new ButtonBuilder()
    .setCustomId(CustomId.helpPage)
    .setLabel(`${pageParam} | ${Math.ceil(help.length / 10)}`)
    .setStyle(1)
    .setDisabled(true);

  const next = new ButtonBuilder()
    .setCustomId(CustomId.helpNext)
    .setLabel("Next")
    .setStyle(3)
    .setDisabled(pageParam >= Math.ceil(help.length / 10));

  const last = new ButtonBuilder()
    .setCustomId(CustomId.helpEnd)
    .setLabel("Last")
    .setDisabled(pageParam + 1 >= Math.ceil(help.length / 10))
    .setStyle(3);

  return new ActionRowBuilder<any>().addComponents([
    first,
    prev,
    page,
    next,
    last,
  ]);
}

export const help: helpI[] = [
  {
    command: "/avatar",
    desc: "Get the avatar of user",
  },
  {
    command: "/random-image",
    desc: "Sends a random image",
  },
  {
    command: "/random-image",
    desc: "Sends an anonymous message",
  },
  {
    command: "/qrcode",
    desc: "Sends an anonymous message",
  },
  {
    command: "/random-number",
    desc: "Sends a random number",
  },
  {
    command: "/remind",
    desc: "Remind you to do something after a certain time",
  },
  {
    command: "/ticket",
    desc: "Send ticket which reports a bug on the server",
  },
  {
    command: "/ask",
    desc: "Ask a large language model your question",
  },
  {
    command: "/fact",
    desc: "Gives you a random fact",
  },
  {
    command: "/image-generate",
    desc: "Generates an image by OpenAi",
  },
  {
    command: "/embed-custom",
    desc: "Makes your custom embed from JSON (embed builders)",
  },
  {
    command: "/embed",
    desc: "Make embed message",
  },
  {
    command: "/rank",
    desc: "Shows your rank",
  },
  {
    command: "/top-rank",
    desc: "Shows top ranks of the server",
  },
  {
    command: "/channel-mod",
    desc: "Sets a channel for moderation (logs, reports, etc...)",
  },
  {
    command: "/channel-temp",
    desc: "Creates a channel that creates a temporary voice channel",
  },
  {
    command: "/current",
    desc: "Show current song",
  },
  {
    command: "/pause",
    desc: "Pause/unpause a song",
  },
  {
    command: "/play-mode",
    desc: "Chooses the mode to play your music",
  },
  {
    command: "/play",
    desc: "Add a song to queue",
  },
  {
    command: "/queue",
    desc: "Shows a queue of songs",
  },
  {
    command: "/skip",
    desc: "Skips current song",
  },
  {
    command: "/poll",
    desc: "Create a poll for a question and its multiple choices",
  },
  {
    command: "/start-channel",
    desc: "Sets a channel for welcomes",
  },
  {
    command: "/start-delete",
    desc: "Deletes start roles",
  },
  {
    command: "/start-message",
    desc: "Sets a welcome message for everyone",
  },
  {
    command: "/start-role",
    desc: "Gives a role when user join to server",
  },
  {
    command: "/start-role",
    desc: "Gives a role when user join to server",
  },
  {
    command: "/twitch-list",
    desc: "Shows your notification list",
  },
  {
    command: "/twitch-add",
    desc: "Send a notification to your channel when the stream starts",
  },
  {
    command: "/twitch-channel",
    desc: "Shows your notification list",
  },
  {
    command: "/twitch-message",
    desc: "Sets a notification message for your twitch notification",
  },
  {
    command: "/twitch-remove",
    desc: "Removes a streamer from your notification list",
  },
  {
    command: "/youtube-list",
    desc: "Shows yours youtube notification list",
  },
  {
    command: "/youtube-add",
    desc: "Adds YouTube channel to your notification list",
  },
  {
    command: "/youtube-channel",
    desc: "Sets notification channel for YouTube notification",
  },
  {
    command: "/youtube-message",
    desc: "Sets a notification message for your YouTube notification",
  },
  {
    command: "/youtube-remove",
    desc: "Removes YouTube channel from your notification list",
  },
  {
    command: "/kick",
    desc: "Kicks a user",
  },
  {
    command: "/slowmode",
    desc: "Sets a timeout to every message in chat",
  },
  {
    command: "/temprole",
    desc: "Adds temporary role to user",
  },
  {
    command: "/timeout",
    desc: "Hard mutes a user (timeout)",
  },
  {
    command: "/bans",
    desc: "Shows a list of banned users",
  },
  {
    command: "/ban",
    desc: "Bans user",
  },
  {
    command: "/unban",
    desc: "Unbans user",
  },
  {
    command: "/blacklist-add",
    desc: "Adds a word to your blacklist",
  },
  {
    command: "/blacklist-remove",
    desc: "Removes a word from your blacklist",
  },
  {
    command: "/blacklist-add-role",
    desc: "Adds a role that the bot will ignore",
  },
  {
    command: "/blacklist-remove-role",
    desc: "Removes a role that the bot will ignore",
  },
  {
    command: "/blacklist-list",
    desc: "Shows a list of banned words",
  },
  {
    command: "/clear-bot",
    desc: "Clears messages from any bots",
  },
  {
    command: "/clear-contain",
    desc: "Clears messages with such contains",
  },
  {
    command: "/clear-embeds",
    desc: "Clears embed messages",
  },
  {
    command: "/clear-files",
    desc: "Clears messages with any files",
  },
  {
    command: "/clear-images",
    desc: "Clears messages with images",
  },
  {
    command: "/clear-link",
    desc: "Clears messages with links",
  },
  {
    command: "/clear-user",
    desc: "Clears messages from certain user",
  },
  {
    command: "/clear",
    desc: "Clears messages with links",
  },
  {
    command: "/mutes",
    desc: "Shows a list of mute users",
  },
  {
    command: "/mute",
    desc: "Mutes a user",
  },
  {
    command: "/unmute",
    desc: "Unmutes a user",
  },
];
