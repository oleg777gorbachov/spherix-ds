import {
  Colors,
  embed,
  event,
  isIncludeLink,
  stringSplit,
  unban,
} from "../../utils";
import models from "../../models";
import { ChannelType } from "discord.js";
const { punishment, modChannel } = models;

const ready = event("ready", async ({ log }, interaction) => {
  const guilds = interaction.guilds.cache;
  guilds.forEach(async (guild) => {
    const gid = guild.id;
    const punishments = await punishment.find({ gid });

    for (let punish of punishments) {
      if (punish.expires === -1) continue;
      const diff = punish.expires - Date.now();
      const gid = guild.id;
      const uid = punish.uid;
      const user = guild.members.cache.get(uid);
      const modModel = await modChannel.findOne({ gid });
      console.log(diff);
      if (punish.type === "ban") {
        unban(guild, punish);
      }
      if (punish.type === "mute") {
        const muteRole = guild?.roles.cache.find((role) =>
          role.name.toLowerCase().includes("muted" || "mute")
        );
        setTimeout(async () => {
          const description = `${user} has been unmuted`;
          const title = "😀 Unmute";
          if (modModel) {
            const channel = guild.channels.cache.get(modModel.channelId);
            if (channel && channel.type === ChannelType.GuildText) {
              await channel.send({
                embeds: [
                  embed({
                    title,
                    description,
                    color: Colors.white,
                    footer: {
                      text: `by time`,
                    },
                  }),
                ],
              });
            }
          }
          if (muteRole) await user?.roles.remove(muteRole);
          await punish.deleteOne();
        }, diff);
      }
      if (punish.type === "timeout") {
        setTimeout(async () => {
          const description = stringSplit([
            `${user} has been untimeoted`,
            `Reason: **${punish.reason}**`,
          ]);
          const title = "✅ Untimeout";
          if (modModel) {
            const channel = guild.channels.cache.get(modModel.channelId);
            if (channel && channel.type === ChannelType.GuildText) {
              await channel.send({
                embeds: [
                  embed({
                    title,
                    description,
                    color: Colors.white,
                    footer: {
                      text: `by time`,
                    },
                  }),
                ],
              });
            }
          }
          await punish.deleteOne();
        }, diff);
      }
    }
  });
});

export default ready;
