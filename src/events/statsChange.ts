import { event } from "../utils";
import models from "../models";

const { stats } = models;

const presence = event("presenceUpdate", async ({ log }, client) => {
  if (client?.guild && !client.user?.bot) {
    const gid = client.guild.id;
    const model = await stats.findOne({ gid });
    if (model?.state) {
      const members = await client?.guild?.members.fetch();
      const online = members?.filter(
        (e) => !e.user.bot && e.presence && e.presence?.status !== "offline"
      ).size;
      const channel = client.guild.channels.cache.get(model.onlineId);
      if (channel) await channel.setName(`🟩 Online: ${online}`);
    }
    const user = client.guild.members.cache.get(client.user?.id!);
    log(
      `${new Date().toLocaleString()} - ${client.user?.tag} went ${
        user?.presence?.status
      }`
    );
  }
});

const leave = event("guildMemberRemove", async ({ log }, client) => {
  if (client?.guild) {
    const gid = client.guild.id;
    const model = await stats.findOne({ gid });
    if (model?.state) {
      const online = await client?.guild?.members.fetch();
      const members = online?.filter((e) => !e.user.bot).size;

      const channel = client.guild.channels.cache.get(model.membersId);

      if (channel) await channel.setName(`👪 Members: ${members}`);
    }
    log(`leave event`);
  }
});

const join = event("guildMemberAdd", async ({ log }, client) => {
  if (client?.guild) {
    const gid = client.guild.id;
    const model = await stats.findOne({ gid });
    if (model?.state) {
      const online = await client?.guild?.members.fetch();
      const members = online?.filter((e) => !e.user.bot).size;

      const channel = client.guild.channels.cache.get(model.membersId);

      if (channel) await channel.setName(`👪 Members: ${members}`);
    }
    log(`leave event`);
  }
});

export default [presence, leave, join];
