import {
  ChannelType,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import models from "../../../models";
import { Colors, command, embed } from "../../../utils";
const { punishment, modChannel } = models;

const meta = new SlashCommandBuilder()
  .setName("untimeout")
  .setDescription("Hard mutes a user (timeout)")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("Provide a username")
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const user = interaction.options.getUser("user");

  const modId = interaction.user.id;
  const mod = interaction.guild?.members.cache.get(modId);

  if (!mod?.permissions.has([PermissionsBitField.Flags.MuteMembers])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const gid = interaction.guild?.id;
  const uid = user?.id;

  const userToMute = interaction.guild?.members.cache.get(user?.id!);

  if (!gid || !uid || !userToMute || !mod) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong data`,
    });
  }

  try {
    await userToMute.timeout(null);
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: "I cannot untimeout that user",
    });
  }

  await punishment.findOneAndDelete({
    gid,
    uid,
    type: "timeout",
  });

  const description = `${userToMute} has been untimeoted`;
  const title = "✅ Untimeout";

  const modModel = await modChannel.findOne({ gid });

  if (modModel) {
    const channel = interaction.guild.channels.cache.get(modModel.channelId);
    if (channel && channel.type === ChannelType.GuildText) {
      await channel.send({
        embeds: [
          embed({
            title,
            description,
            color: Colors.white,
            thumbnail: {
              url: mod.displayAvatarURL(),
            },
            footer: {
              text: `id: ${mod.id} | by ${mod.user.tag}`,
            },
          }),
        ],
      });
    }
  }

  return interaction.reply({
    embeds: [
      embed({
        title,
        description,
        footer: {
          text: `by ${mod.displayName}`,
        },
      }),
    ],
  });
});
