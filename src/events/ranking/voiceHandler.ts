import { event } from "../../utils";
import models from "../../models";
import { Collection } from "discord.js";
const { ranks } = models;

const time = new Collection<any, number>();

export default event(
  "voiceStateUpdate",
  async ({ log }, oldClient, newClient) => {
    const gid = oldClient.guild.id;
    const uid = newClient.member?.id;

    if (!newClient.member?.user.bot) return;

    if (oldClient.channelId !== newClient.channelId) {
      // User moved to a different voice channel

      const channel = await ranks.findOne({
        gid,
        uid,
      });
      const timeInChannel = Date.now() - (time.get(gid + uid) || Date.now());

      if (channel) {
        channel.voice = channel.voice + timeInChannel;
        await channel.save();
      } else {
        await new ranks({
          uid,
          gid,
          voice: timeInChannel,
          messages: 0,
          messagesLength: 0,
        }).save();
      }

      if (oldClient.channelId) {
        // User left a voice channel
        time.delete(gid + uid);
      }

      if (newClient.channelId) {
        // User joined a voice channel
        time.set(gid + uid, new Date().getTime());
      }
    }
  }
);
