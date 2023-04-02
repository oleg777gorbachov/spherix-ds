import { Collection, Guild, OAuth2Guild, TextChannel } from "discord.js";
import { fetchVideos, replacer } from "../../utils";
import models from "../../models";
const { notification } = models;

export async function youtubeRun(
  channelId: string,
  guild: OAuth2Guild | Guild,
  collection: Collection<any, NodeJS.Timer>
) {
  const interval = setInterval(() => run(), 30000);
  collection.set(guild.id + channelId, interval);
  async function run() {
    const isExist = await notification.findOne({ gid: guild.id });
    if (!isExist) return;
    const videos = await fetchVideos(channelId);
    if (!videos) return;
    const etag = videos.items[0].etag;
    if (!isExist.etags.includes(etag)) {
      const channel = guild.client.channels.cache.get(isExist.channelYoutube);
      isExist.etags.push(etag);
      await isExist.save();
      const replaced = replacer(isExist.messageYoutube, [
        {
          label: "LINK",
          value: `https://www.youtube.com/watch?v=${videos.items[0].id.videoId}`,
        },
        {
          label: "NAME",
          value: videos.items[0].snippet.channelTitle,
        },
      ]);

      (channel as TextChannel).send({
        content: `${replaced}`,
      });
    }
  }
}

export async function youtubeRemove(
  channelId: string,
  guild: OAuth2Guild | Guild,
  collection: Collection<any, NodeJS.Timer>
) {
  const interval = collection.get(guild.id + channelId);
  clearInterval(interval);
}
