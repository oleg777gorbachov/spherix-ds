import { TextChannel } from "discord.js";
import { embed } from "../../utils/embed";
import { Colors, event } from "../../utils";
import models from "../../models";
const { logs } = models;

const banAdd = event("guildBanAdd", async ({ log }, client) => {
  const gid = client.guild.id;

  const isExist = await logs.findOne({ gid });

  if (!isExist) return;

  const channel = client.guild.channels.cache.get(
    isExist.channelId
  ) as TextChannel;

  channel.send({
    embeds: [
      embed({
        title: "🚫 User banned",
        description: `${client.user} - **was banned**\n**uid** ${client.user.id}`,
        footer: {
          icon_url: client.user.displayAvatarURL()!,
          text: `${new Date().toLocaleString()}`,
        },
        color: Colors.white,
      }),
    ],
  });
  log("guildBanAdd");
});

const banRemove = event("guildBanRemove", async ({ log }, client) => {
  const gid = client.guild.id;

  const isExist = await logs.findOne({ gid });

  if (!isExist) return;

  const channel = client.guild.channels.cache.get(
    isExist.channelId
  ) as TextChannel;

  channel.send({
    embeds: [
      embed({
        title: "✅ User unbanned",
        description: `${client.user} - **was unbanned**\n**uid** ${client.user.id}`,
        footer: {
          icon_url: client.user.displayAvatarURL()!,
          text: `${new Date().toLocaleString()}`,
        },
        color: Colors.white,
      }),
    ],
  });
  log("guildBanRemove");
});

export default [banAdd, banRemove];
