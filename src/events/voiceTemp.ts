import { ChannelType, Collection } from "discord.js";
import { event } from "../utils";
import models from "../models";
const { tempChannel } = models;

const voiceCollection = new Collection<
  any,
  { channelid: string; roleid: string }
>();

export default event("voiceStateUpdate", async ({ log }, client, newClient) => {
  const gid = newClient.guild.id;
  if (gid) {
    const model = await tempChannel.findOne({ gid });

    if (model && newClient.channelId === model.channelId) {
      const user = client.guild.members.cache.get(client.id);
      const role = await client.guild.roles.create({
        name: user?.user.tag,
      });
      user?.roles.add(role);
      const newChannel = await client.guild.channels.create({
        name: user?.user.tag!,
        type: ChannelType.GuildVoice,
        permissionOverwrites: [
          {
            id: role.id,
            allow: ["DeafenMembers", "KickMembers", "MuteMembers"],
          },
        ],
      });
      user?.voice.setChannel(newChannel);
      voiceCollection.set(user?.id, {
        channelid: newChannel.id,
        roleid: role.id,
      });
    } else if (!newClient.channel) {
      if (client.channelId === voiceCollection.get(newClient.id)?.channelid) {
        const user = client.guild.members.cache.get(newClient.id);
        const role = client.guild.roles.cache.get(
          voiceCollection.get(newClient.id)?.roleid!
        );
        await user?.roles.remove(role!);

        await client.guild.roles.delete(role!);
        return client.channel?.delete();
      }
    }
  }
  //   log(gid, newClient.channelId);
});
