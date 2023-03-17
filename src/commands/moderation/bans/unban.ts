import {
  APIEmbedFooter,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { Colors, command, embed } from "../../../utils";

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
    await interaction.client.users.send(userToUnban, {
      embeds: [
        embed({
          title: `You have been unbanned on ${interaction.guild?.name}`,
          description: `__Your welcome ${
            userToUnban.username
          }__\n${linkToServer?.toString()}\nunbanned by **${mod.user.tag}**`,
          color: Colors.success,
        }),
      ],
    });
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: "I cannot unban that user",
    });
  }

  const footer: APIEmbedFooter = {
    text: `by ${mod.displayName}`,
  };

  return interaction.reply({
    embeds: [
      embed({
        color: Colors.success,
        title: "Unban",
        description: `${userToUnban.tag} has been **unbanned**!`,
        footer,
      }),
    ],
  });
});
