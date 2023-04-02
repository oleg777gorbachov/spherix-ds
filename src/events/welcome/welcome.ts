import { Role, TextChannel } from "discord.js";
import { event, replacer } from "../../utils";
import models from "../../models";
import role from "../logs/role";

const { welcomeRole } = models;

export default event("guildMemberAdd", async ({ log }, client) => {
  const gid = client.guild.id;
  const roleDb = await welcomeRole.findOne({ gid });
  if (!roleDb || !roleDb.roleId) {
    return;
  }
  const roles: Role[] = [];
  for (let role of roleDb.roleId) {
    const r = client.guild.roles.cache.get(role);
    if (r) roles.push(r);
  }
  if (roles) {
    let desc = ``;
    const member = client.guild.members.cache.get(client.user.id);
    if (!member) return;
    for (let role of roles) {
      member.roles.add(role);
      desc += role.name + " ";
    }
    log(`Role ${desc} was given to ${client.user.tag}`);
  }

  if (roleDb.messageState && roleDb.message) {
    const content = replacer(roleDb.message, [
      {
        label: "NAME",
        value: client.user as never as string,
      },
      {
        label: "SERVER",
        value: client.guild?.name!,
      },
    ]);

    if (roleDb.channelId === "DM") {
      return client.user.send({
        content,
      });
    } else {
      const channel = client.guild.channels.cache.get(roleDb.channelId!);
      if (channel && roleDb.message) {
        return (channel as TextChannel).send({
          content,
        });
      }
    }
  }
});
