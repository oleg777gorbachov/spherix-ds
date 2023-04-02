import {
  ChannelType,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { Colors, command, DM, embed } from "../../../utils";
import models from "../../../models";
const { punishment, modChannel } = models;

const meta = new SlashCommandBuilder()
  .setName("unban")
  .setDescription("Unbans user")
  .addUserOption((option) =>
    option.setName("user").setDescription("Provide a user").setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("uid")
      .setDescription("Provide a username id")
      .setRequired(false)
  );

export default command(meta, async ({ interaction }) => {
  const user = interaction.options.getUser("user");
  const uid = interaction.options.getString("uid");

  const gid = interaction.guildId;
  const modId = interaction.user.id;
  const mod = interaction.guild?.members.cache.get(modId);

  if (!mod?.permissions.has([PermissionsBitField.Flags.BanMembers])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  if (!user && !uid) {
    return interaction.reply({
      ephemeral: true,
      content: `Provide arguments`,
    });
  }

  let userToUnban;
  try {
    userToUnban = await interaction.client.users.fetch(user?.id || uid || "");
    if (!userToUnban || !mod) {
      return interaction.reply({
        ephemeral: true,
        content: `Wrong data`,
      });
    }
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong data`,
    });
  }

  try {
    const linkToServer = await interaction.guild?.invites.create(
      interaction.channel as TextChannel,
      {
        maxAge: 0,
        maxUses: 0,
      }
    );
    await interaction.guild?.members.unban(userToUnban);
    await DM(
      interaction,
      {
        embeds: [
          embed({
            title: `You have been unbanned on ${interaction.guild?.name}`,
            description: `__Your welcome ${
              userToUnban.username
            }__\n${linkToServer?.toString()}\nunbanned by **${mod.user.tag}**`,
            color: Colors.success,
            footer: {
              icon_url: interaction.guild?.iconURL()!,
              text: `${interaction.guild?.name}`,
            },
          }),
        ],
      },
      userToUnban
    );
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: "I cannot unban that user",
    });
  }

  const title = "✅ Unban";
  const description = `${userToUnban} has been **unbanned**!`;

  const modModel = await modChannel.findOne({ gid });

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

  const model = await punishment.find({
    gid: interaction.guild?.id,
    uid: user?.id,
  });

  for (let key of model) {
    await key.deleteOne();
  }

  return interaction.reply({
    embeds: [
      embed({
        color: Colors.success,
        title,
        description,
        footer: {
          text: `by ${mod.displayName}`,
        },
      }),
    ],
  });
});
