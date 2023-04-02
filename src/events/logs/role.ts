import { TextChannel, PermissionsString } from "discord.js";
import { embed } from "../../utils/embed";
import { Colors, event } from "../../utils";
import models from "../../models";
const { logs } = models;

const create = event("roleCreate", async ({ log }, client) => {
  const gid = client.guild.id;

  const isExist = await logs.findOne({ gid });
  if (!isExist) return;

  const channel = client.guild.channels.cache.get(
    isExist.channelId
  ) as TextChannel;

  channel.send({
    embeds: [
      embed({
        title: "Role created",
        description: `${client} - **role created**\n**id** ${client.id}`,
        footer: {
          text: `${new Date().toLocaleString()}`,
        },
        color: Colors.white,
      }),
    ],
  });
});

const leave = event("roleDelete", async ({ log }, client) => {
  const gid = client.guild.id;

  const isExist = await logs.findOne({ gid });

  if (!isExist) return;

  const channel = client.guild.channels.cache.get(
    isExist.channelId
  ) as TextChannel;

  channel.send({
    embeds: [
      embed({
        title: "Role deleted",
        description: `${client.name} - **role deleted**\n**id** ${client.id}`,
        footer: {
          text: `${new Date().toLocaleString()}`,
        },
        color: Colors.white,
      }),
    ],
  });
});

const update = event("roleUpdate", async ({ log }, client, newClient) => {
  const gid = client.guild.id;

  const isExist = await logs.findOne({ gid });

  if (!isExist) return;

  const channel = client.guild.channels.cache.get(
    isExist.channelId
  ) as TextChannel;

  if (client.permissions.bitfield !== newClient.permissions.bitfield) {
    const oldPermissions: PermissionsString[] = [];
    const newPermissions: PermissionsString[] = [];

    newClient.permissions.toArray().forEach((permission) => {
      if (!client.permissions.has(permission)) {
        log(permission);
        newPermissions.push(permission);
      }
    });

    client.permissions.toArray().forEach((permission) => {
      if (!newClient.permissions.has(permission)) {
        log(permission);
        oldPermissions.push(permission);
      }
    });

    let desc = `${client} - role updated\nid ${client.id}`;

    if (newPermissions.length > 0) {
      desc += `\n**Added**` + newPermissions.map((e) => " " + e).toString();
    }

    if (oldPermissions.length > 0) {
      desc += `\n**Removed**` + oldPermissions.map((e) => " " + e).toString();
    }

    channel.send({
      embeds: [
        embed({
          title: "Role updated",
          description: desc,
          footer: {
            text: `${new Date().toLocaleString()}`,
          },
          color: Colors.white,
        }),
      ],
    });
  }
});

const memberUpdate = event(
  "guildMemberUpdate",
  async ({ log }, client, newClient) => {
    const oldRoles = client.roles.cache;
    const newRoles = newClient.roles.cache;

    const gid = newClient.guild.id;
    const isExist = await logs.findOne({ gid });
    if (!isExist) return;

    const channel = newClient.guild.channels.cache.get(
      isExist.channelId
    ) as TextChannel;

    oldRoles.forEach((role) => {
      if (!newClient.roles.cache.has(role.id)) {
        channel.send({
          embeds: [
            embed({
              title: "Member role updated",
              description: `Role ${role}\nhas been removed from ${newClient.user}.`,
              thumbnail: { url: newClient.user.displayAvatarURL() },
              footer: {
                text: `${new Date().toLocaleString()}`,
              },
              color: Colors.white,
            }),
          ],
        });
      }
    });

    newRoles.forEach(async (role) => {
      if (!oldRoles.has(role.id)) {
        channel.send({
          embeds: [
            embed({
              title: "Member role updated",
              description: `User ${newClient.user}\ngot new role ${role}.`,
              thumbnail: { url: newClient.user.displayAvatarURL() },
              footer: {
                text: `${new Date().toLocaleString()}`,
              },
              color: Colors.white,
            }),
          ],
        });
      }
    });
  }
);

export default [leave, create, update, memberUpdate];
