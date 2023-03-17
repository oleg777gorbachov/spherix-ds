import {
  APIEmbedFooter,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { Colors, command, embed } from "../../../utils";
import models from "../../../models";

const { punishment } = models;

const meta = new SlashCommandBuilder()
  .setName("unmute")
  .setDescription("Unmutes a user")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("Provide a username")
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const user = interaction.options.getUser("user");

  const modId = interaction.user.id;
  const mod = await interaction.guild?.members.fetch(modId);

  if (!mod?.permissions.has([PermissionsBitField.Flags.MuteMembers])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const gid = interaction.guild?.id;
  const uid = user?.id;

  const muteRole = interaction.guild?.roles.cache.find((role) =>
    role.name.toLowerCase().includes("muted" || "mute")
  );
  const userToMute = await interaction.guild?.members.fetch(user?.id || "");

  if (!gid || !uid || !userToMute || !mod || !muteRole) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong data`,
    });
  }

  await punishment.findOneAndDelete({ gid, uid });

  try {
    userToMute.roles.remove(muteRole);
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: "I cannot unmute that user",
    });
  }

  const footer: APIEmbedFooter = {
    text: `by ${mod.displayName}`,
  };

  return interaction.reply({
    embeds: [
      embed({
        title: "Unmute",
        description: `${userToMute} has been unmuted`,
        color: Colors.success,
        footer,
      }),
    ],
  });
});
