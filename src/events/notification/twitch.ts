import { Collection, Guild, OAuth2Guild, TextChannel } from "discord.js";
import TwitchApi from "node-twitch";
import models from "../../models";
import { replacer } from "../../utils";
const { notification } = models;

export async function twitchRun(
  streamer: string,
  twitch: TwitchApi,
  guild: OAuth2Guild | Guild,
  collection: Collection<any, NodeJS.Timer>
) {
  let IsLiveMemory = false;
  const interval = setInterval(() => Run(streamer), 30000);
  collection.set(guild.id + streamer, interval);
  async function Run(channel: string) {
    const isExist = await notification.findOne({ gid: guild.id });
    if (!isExist) return;
    await twitch
      .getStreams({ channel })
      .then(async (data) => {
        const r = data.data[0];
        const ChannelAnnounceLive = guild.client.channels.cache.find(
          (x) => x.id === isExist?.channelTwitch
        );

        if (!r) {
          IsLiveMemory = false;
          isExist.live = isExist.live.filter((e) => e !== streamer);
          await isExist.save();
          return;
        }

        if (r.type === "live") {
          if (
            (IsLiveMemory === false && !isExist.live.includes(streamer)) ||
            (IsLiveMemory === undefined && !isExist.live.includes(streamer))
          ) {
            IsLiveMemory = true;
            isExist.live.push(streamer);
            await isExist.save();

            const replaced = replacer(isExist.messageTwitch, [
              {
                label: "LINK",
                value: `https://www.twitch.tv/${streamer}`,
              },
            ]);

            (ChannelAnnounceLive as TextChannel).send({
              content: `${replaced}`,
            });
          }
        } else {
          IsLiveMemory = false;
          isExist.live = isExist.live.filter((e) => e !== streamer);
          await isExist.save();
        }
      })
      .catch(() => null);
  }
}

export function twitchRemove(
  guild: Guild,
  streamer: string,
  collection: Collection<any, NodeJS.Timer>
) {
  const interval = collection.get(guild.id! + streamer);
  clearInterval(interval);
}
