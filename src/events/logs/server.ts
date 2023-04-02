import { TextChannel } from "discord.js";
import { embed } from "../../utils/embed";
import { Colors, event } from "../../utils";
import models from "../../models";
const { logs } = models;

const join = event("guildUpdate", async ({ log }, oldGuild, newGuild) => {
  const gid = newGuild.id;

  const isExist = await logs.findOne({ gid });
  if (!isExist) return;

  const channel = newGuild.channels.cache.get(isExist.channelId) as TextChannel;

  let desc = ``;

  if (oldGuild.name !== newGuild.name) {
    desc += `Name changed from "${oldGuild.name}" to "${newGuild.name}"\n`;
  }

  if (oldGuild.description !== newGuild.description) {
    desc += `Description changed from "${oldGuild.description}" to "${newGuild.description}"\n`;
  }

  if (oldGuild.icon !== newGuild.icon) {
    desc += `Icon changed from "${oldGuild.iconURL()}" to "${newGuild.iconURL()}"\n`;
  }

  if (oldGuild.banner !== newGuild.banner) {
    desc += `Banner changed from "${oldGuild.bannerURL()}" to "${newGuild.bannerURL()}"\n`;
  }

  if (oldGuild.splash !== newGuild.splash) {
    desc += `Splash changed from "${oldGuild.splashURL()}" to "${newGuild.splashURL()}"\n`;
  }

  if (oldGuild.ownerId !== newGuild.ownerId) {
    desc += `Owner changed from "${oldGuild.ownerId}" to "${newGuild.ownerId}"\n`;
  }

  if (oldGuild.systemChannelId !== newGuild.systemChannelId) {
    desc += `System channel changed from "${oldGuild.systemChannel}" to "${newGuild.systemChannel}"\n`;
  }

  if (oldGuild.afkChannelId !== newGuild.afkChannelId) {
    desc += `Afk channel changed from "${oldGuild.afkChannel}" to "${newGuild.afkChannel}"\n`;
  }

  if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
    desc += `Afk timeout changed from "${oldGuild.afkTimeout / 60} min" to "${
      newGuild.afkTimeout / 60
    } min"\n`;
  }

  if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
    desc += `Verification level changed from "${oldGuild.verificationLevel}" to "${newGuild.verificationLevel}"\n`;
  }

  if (oldGuild.nsfwLevel !== newGuild.nsfwLevel) {
    desc += `NSFW level changed from "${oldGuild.nsfwLevel}" to "${newGuild.nsfwLevel}"\n`;
  }

  if (oldGuild.preferredLocale !== newGuild.preferredLocale) {
    desc += `Prefered locale from "${oldGuild.preferredLocale}" to "${newGuild.preferredLocale}"\n`;
  }

  if (oldGuild.systemChannel !== newGuild.systemChannel) {
    desc += `System chanenl changed from "${oldGuild.preferredLocale}" to "${newGuild.preferredLocale}"\n`;
  }

  if (oldGuild.emojis !== newGuild.emojis) {
    if (oldGuild.emojis.cache.size > newGuild.emojis.cache.size) {
      desc += `Emoji was removed\n`;
    } else {
      desc += `Emoji was added\n`;
    }
  }

  channel.send({
    embeds: [
      embed({
        title: "Server updated",
        description: desc,
        footer: {
          text: `${new Date().toLocaleString()}`,
        },
        color: Colors.white,
      }),
    ],
  });
});

export default [join];
