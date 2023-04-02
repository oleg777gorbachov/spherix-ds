import {
  BitField,
  ChannelType,
  NonThreadGuildBasedChannel,
  PermissionResolvable,
  PermissionsBitField,
  PermissionsString,
  Role,
  TextChannel,
} from "discord.js";
import { embed } from "../../utils/embed";
import { Colors, event, stringSplit } from "../../utils";
import models from "../../models";
const { logs } = models;

const banAdd = event("channelCreate", async ({ log }, client) => {
  const gid = client.guild.id;

  const isExist = await logs.findOne({ gid });

  if (!isExist) return;

  const channel = client.guild.channels.cache.get(
    isExist.channelId
  ) as TextChannel;

  channel.send({
    embeds: [
      embed({
        title: "Channel created",
        description: `${client} - **was created**\n**Category** - ${
          client.parent === null ? "none" : client.parent
        }\n**id** ${client.id}`,
        footer: {
          text: `${new Date().toLocaleString()}`,
        },
        color: Colors.white,
      }),
    ],
  });
});

const banRemove = event("channelDelete", async ({ log }, client) => {
  const interaction = client as NonThreadGuildBasedChannel;
  const gid = interaction.guild.id;

  const isExist = await logs.findOne({ gid });

  if (!isExist) return;

  const channel = interaction.guild.channels.cache.get(
    isExist.channelId
  ) as TextChannel;

  channel.send({
    embeds: [
      embed({
        title: "Channel was deleted",
        description: `${interaction.name} - **was deleted**\n**Category** - ${
          interaction.parent === null ? "none" : interaction.parent
        }\n**id** ${client.id}`,
        footer: {
          text: `${new Date().toLocaleString()}`,
        },
        color: Colors.white,
      }),
    ],
  });
});

const move = event("channelUpdate", async ({ log }, client, newClient) => {
  const interaction = client as NonThreadGuildBasedChannel;
  const newInteraction = newClient as NonThreadGuildBasedChannel;
  const gid = interaction.guild.id;
  const isExist = await logs.findOne({ gid });
  if (!isExist) return;

  let desc: string[] = [];

  const channel = interaction.guild.channels.cache.get(
    isExist.channelId
  ) as TextChannel;

  desc.push(
    stringSplit([
      `${interaction} updated`,
      `Category: **${
        interaction.parent === null ? "none" : interaction.parent
      }**`,
      `Id **${client.id}**`,
    ])
  );

  if (interaction.name !== newInteraction.name) {
    desc.push(`Name changed - ${interaction.name} to ${newInteraction.name}`);
  }

  const GuildText =
    newInteraction.type === ChannelType.GuildText &&
    interaction.type === ChannelType.GuildText;

  const GuildForum =
    newInteraction.type === ChannelType.GuildForum &&
    interaction.type === ChannelType.GuildForum;

  if (GuildText || GuildForum) {
    if (interaction.topic !== newInteraction.topic) {
      desc.push(
        `Topic changed - ${interaction.name} to ${newInteraction.name}`
      );
    }
  }

  // Check if the permissions of the channel were updated
  if (
    interaction.permissionOverwrites !== newInteraction.permissionOverwrites
  ) {
    let newPermissionsAllow: string[] = [];
    let newPermissionsDeny: string[] = [];
    let newPermissionsNeutral: string[] = [];
    let role: Role | undefined;

    newInteraction.permissionOverwrites.cache.forEach((perms) => {
      newPermissionsAllow.push(...permConvert(perms.allow.bitfield));
      newPermissionsDeny.push(...permConvert(perms.deny.bitfield));
      role = interaction.guild.roles.cache.get(perms.id);
    });

    interaction.permissionOverwrites.cache.forEach((perms) => {
      let newPermsAllow: string[] = [];
      let newPermsDeny: string[] = [];
      const allow = permConvert(perms.allow.bitfield);
      const deny = permConvert(perms.deny.bitfield);
      for (let key of allow) {
        if (
          !newPermissionsAllow.includes(key) &&
          !newPermissionsDeny.includes(key)
        ) {
          console.log(key);
          newPermissionsNeutral.push(key);
        }
      }
      for (let key of deny) {
        if (
          !newPermissionsDeny.includes(key) &&
          !newPermissionsAllow.includes(key)
        ) {
          console.log(key);
          newPermissionsNeutral.push(key);
        }
      }
      for (let key of newPermissionsAllow) {
        if (!allow.includes(key)) {
          newPermsAllow.push(key);
        }
      }
      for (let key of newPermissionsDeny) {
        if (!deny.includes(key)) {
          newPermsDeny.push(key);
        }
      }
      newPermissionsAllow = newPermsAllow;
      newPermissionsDeny = newPermsDeny;
    });

    if (role) {
      desc.push(`Permission changed for ${role}`);
    }

    if (newPermissionsAllow.length > 0) {
      desc.push(`✅ Added: **${newPermissionsAllow.join(" ")}**`);
    }
    if (newPermissionsNeutral.length > 0) {
      desc.push(`⬜ Neutral: **${newPermissionsNeutral.join(" ")}**`);
    }
    if (newPermissionsDeny.length > 0) {
      desc.push(`⛔ Removed: **${newPermissionsDeny.join(" ")}**`);
    }
  }

  if (channel && client !== newClient) {
    channel.send({
      embeds: [
        embed({
          title: "Channel was updated",
          description: stringSplit(desc),
          footer: {
            text: `${new Date().toLocaleString()}`,
          },
          color: Colors.white,
        }),
      ],
    });
  }
});

function permConvert(bit: bigint) {
  const bitfield = bit;
  const permissions = Object.keys(PermissionsBitField.Flags).filter(
    (p) =>
      (bitfield &
        PermissionsBitField.Flags[
          p as keyof typeof PermissionsBitField.Flags
        ]) ===
      PermissionsBitField.Flags[p as keyof typeof PermissionsBitField.Flags]
  );
  return permissions;
}

export default [banAdd, banRemove, move];
