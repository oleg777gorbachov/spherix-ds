import {
  APIEmbedFooter,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { command, embed } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("kick")
  .setDescription("Kicks a user")
  .addUserOption((option) =>
    option.setName("user").setDescription("Enter a username").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Enter a reason to mute user")
      .setMinLength(1)
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const user = interaction.options.getUser("user");
  const reason = interaction.options.getString("reason");

  const modId = interaction.user.id;
  const mod = await interaction.guild?.members.fetch(modId);

  if (!mod?.permissions.has([PermissionsBitField.Flags.KickMembers])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const userToKick = await interaction.guild?.members.fetch(user?.id || "");

  if (!reason || !user || !userToKick || !mod) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong data`,
    });
  }

  try {
    await userToKick.kick(reason);
    await interaction.client.users.send(userToKick, {
      embeds: [
        embed({
          title: "Kick",
          description: `You're kicked by ${mod.user.tag}\nReason: ${reason}`,
        }),
      ],
    });
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: "I cannot kick that user",
    });
  }

  const footer: APIEmbedFooter = {
    text: `by ${mod.displayName}`,
  };

  return interaction.reply({
    embeds: [
      embed({
        title: "Kick",
        description: `${userToKick} has been kicked.\nReason: **${reason}**`,
        footer,
      }),
    ],
  });
});
