import { TextChannel } from "discord.js";
import { embed } from "../../utils/embed";
import { Colors, event } from "../../utils";
import models from "../../models";
const { logs } = models;

const join = event("guildMemberAdd", async ({ log }, client) => {
  const gid = client.guild.id;

  const isExist = await logs.findOne({ gid });
  log("gid");
  if (!isExist) return;

  const channel = client.guild.channels.cache.get(
    isExist.channelId
  ) as TextChannel;

  channel.send({
    embeds: [
      embed({
        title: "User joined",
        description: `${client.user} - **joined to our server**\n**uid** ${client.user.id}`,
        footer: {
          icon_url: client.user.displayAvatarURL()!,
          text: `${new Date().toLocaleString()}`,
        },
        color: Colors.white,
      }),
    ],
  });
});

const leave = event("guildMemberRemove", async ({ log }, client) => {
  const gid = client.guild.id;

  const isExist = await logs.findOne({ gid });

  if (!isExist) return;

  const channel = client.guild.channels.cache.get(
    isExist.channelId
  ) as TextChannel;

  channel.send({
    embeds: [
      embed({
        title: "User leave server",
        description: `${client.user} - **leave our server**\n**uid** ${client.user.id}`,
        footer: {
          icon_url: client.user.displayAvatarURL()!,
          text: `${new Date().toLocaleString()}`,
        },
        color: Colors.white,
      }),
    ],
  });
});

export default [leave, join];
