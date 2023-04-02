import { Guild, TextChannel } from "discord.js";
import { embed } from "../../utils/embed";
import { Colors, event } from "../../utils";
import models from "../../models";
const { logs } = models;

const create = event("inviteCreate", async ({ log }, client) => {
  const gid = client.guild?.id;

  const isExist = await logs.findOne({ gid });

  if (!isExist) return;

  const channel = (client.guild as Guild)?.channels.cache.get(
    isExist.channelId
  ) as TextChannel;

  channel.send({
    embeds: [
      embed({
        title: "Invite created",
        description: `${client.code} - **invite code**\n${client.targetUser} - **user**\n**uid** ${client.targetUser?.id}`,
        footer: {
          icon_url: client.targetUser?.displayAvatarURL()!,
          text: `${new Date().toLocaleString()}`,
        },
        color: Colors.white,
      }),
    ],
  });
  log("guildBanAdd");
});

const remove = event("inviteDelete", async ({ log }, client) => {
  const gid = client.guild?.id;

  const isExist = await logs.findOne({ gid });

  if (!isExist) return;

  const channel = (client.guild as Guild).channels.cache.get(
    isExist.channelId
  ) as TextChannel;

  channel.send({
    embeds: [
      embed({
        title: "Invite deleted",
        description: `${client.code} - **invite code**\n${client.targetUser} - **user**\n**uid** ${client.targetUser?.id}`,
        footer: {
          icon_url: client.targetUser?.displayAvatarURL()!,
          text: `${new Date().toLocaleString()}`,
        },
        color: Colors.white,
      }),
    ],
  });
  log("guildBanAdd");
});

export default [create, remove];
