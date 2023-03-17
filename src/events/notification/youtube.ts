import { Collection, Guild, OAuth2Guild, TextChannel } from "discord.js";
import { notificationI } from "../../types";
import { fetchVideos } from "../../utils";

export async function youtubeRun(
  channelId: string,
  guild: OAuth2Guild | Guild,
  isExist: notificationI,
  collection: Collection<any, NodeJS.Timer>
) {
  const interval = setInterval(() => run(), 30000);
  collection.set(guild.id + channelId, interval);
  async function run() {
    const videos = await fetchVideos(channelId);
    if (!videos) return;
    const etag = videos.items[0].etag;
    if (!isExist.etags.includes(etag)) {
      const channel = guild.client.channels.cache.get(isExist.channelYoutube);
      isExist.etags.push(etag);
      await isExist.save();
      (channel as TextChannel).send({
        content: `${isExist.messageYoutube
          .replace(
            /LINK/g,
            "https://www.youtube.com/watch?v=" + videos.items[0].id.videoId
          )
          .replace(/NAME/g, videos.items[0].snippet.channelTitle)}`,
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
