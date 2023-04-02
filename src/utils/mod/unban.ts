import { ChannelType, Guild } from "discord.js";
import { Colors, DM, embed, stringSplit } from "..";
import punishment from "../../models/punishment";
import { punishmentI } from "../../types";
import modChannel from "../../models/modChannel";

export async function unban(interaction: Guild, punish: punishmentI) {
  const diff = punish.expires - Date.now();
  const user = await interaction.client.users.fetch(punish.uid);
  const mod = await interaction.client.users.fetch(punish.modId);

  if (!user) return;
  const inviteChannel = interaction.channels.cache.filter(
    (ch) => ch.type === ChannelType.GuildText
  );
  console.log(Object.entries(inviteChannel), diff);

  setTimeout(async () => {
    await interaction.members.unban(user);
    await punishment.findOneAndDelete({ _id: punish.id });
    const modModel = await modChannel.findOne({ gid: interaction.id });

    if (modChannel) {
      const description = `${user} has been **unbanned**!`;
      const title = "✅ Unban";
      if (modModel) {
        const channel = interaction.channels.cache.get(modModel.channelId);
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
    }

    const linkToServer = await interaction.invites.create(
      Object.entries(inviteChannel)[0][1],
      {
        maxAge: 0,
        maxUses: 0,
      }
    );
    await DM(
      interaction.client,
      {
        embeds: [
          embed({
            title: `✅ You have been unbanned on ${interaction.name}`,
            description: stringSplit([
              `__Your welcome ${user.username}__`,
              `${linkToServer?.toString()}`,
              `unbanned by **${mod?.tag}**`,
            ]),
            color: Colors.success,
          }),
        ],
      },
      user
    );
  }, diff);
}
