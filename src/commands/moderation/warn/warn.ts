import {
  APIEmbedFooter,
  ChannelType,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { Colors, command, DM, embed } from "../../../utils";
import models from "../../../models";
const { warns, modChannel } = models;

const meta = new SlashCommandBuilder()
  .setName("warn")
  .setDescription("Warns user")
  .addUserOption((option) =>
    option.setName("user").setDescription("Enter a username").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Enter a reason to warn user")
      .setMinLength(1)
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const user = interaction.options.getUser("user");
  const reason = interaction.options.getString("reason") as string;

  const modId = interaction.user.id;
  const mod = interaction.guild?.members.cache.get(modId);

  if (!mod?.permissions.has([PermissionsBitField.Flags.KickMembers])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const userToWarn = interaction.guild?.members.cache.get(user?.id!);

  if (!reason || !user || !userToWarn || !mod) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong data`,
    });
  }

  const gid = interaction.guild?.id;

  try {
    await userToWarn.timeout(null, reason);
    const id = await warns.findOne({ gid }).sort({ id: -1 });
    console.log(id);
    await new warns({
      gid,
      uid: user.id,
      modId: interaction.user.id,
      reason: reason,
      id: id?.id + 1 || 1,
    }).save();

    await DM(
      interaction,
      {
        embeds: [
          embed({
            title: "⚠️ Warn",
            description: `You're warned by ${mod.user.tag}\nReason: ${reason}`,
            footer: {
              icon_url: interaction.guild?.iconURL()!,
              text: `${interaction.guild?.name}`,
            },
            color: Colors.warn,
          }),
        ],
      },
      userToWarn
    );
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: "❌ I cannot warn that user",
    });
  }

  const modModel = await modChannel.findOne({ gid });

  const title = "⚠️ Warn";
  const description = `${userToWarn} has been warned.\nReason: **${reason}**`;

  if (modModel) {
    const channel = interaction.guild?.channels.cache.get(modModel.channelId);
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

  const footer: APIEmbedFooter = {
    text: `by ${mod.displayName}`,
  };

  return interaction.reply({
    embeds: [
      embed({
        title,
        description,
        footer,
        color: Colors.warn,
      }),
    ],
  });
});
