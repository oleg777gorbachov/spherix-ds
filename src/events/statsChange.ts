import { event } from "../utils";
import models from "../models";

const { stats } = models;

const leave = event("guildMemberRemove", async ({ log }, client) => {
  if (client?.guild) {
    const gid = client.guild.id;
    const model = await stats.findOne({ gid });
    if (model?.state) {
      const online = await client?.guild?.members.fetch();
      const members = online?.filter((e) => !e.user.bot).size;
      const bots = online?.filter((e) => e.user.bot).size;

      const membersChannel = client.guild.channels.cache.get(model.membersId);
      const allMembersChannel = client.guild.channels.cache.get(
        model.allMembersId
      );
      const botsChannel = client.guild.channels.cache.get(model.botId);

      if (membersChannel)
        await membersChannel.setName(`👪 Members: ${members}`);
      if (allMembersChannel)
        await allMembersChannel.setName(`🟩 All Members: ${online?.size}`);
      if (botsChannel) await botsChannel.setName(`🤖 Bots: ${bots}`);
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
      const bots = online?.filter((e) => e.user.bot).size;

      const membersChannel = client.guild.channels.cache.get(model.membersId);
      const allMembersChannel = client.guild.channels.cache.get(
        model.allMembersId
      );
      const botsChannel = client.guild.channels.cache.get(model.botId);

      if (membersChannel)
        await membersChannel.setName(`👪 Members: ${members}`);
      if (allMembersChannel)
        await allMembersChannel.setName(`🟩 All Members: ${online?.size}`);
      if (botsChannel) await botsChannel.setName(`🤖 Bots: ${bots}`);
    }
    log(`leave event`);
  }
});

export default [leave, join];
