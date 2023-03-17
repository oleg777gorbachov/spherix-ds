import {
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("message")
  .setDescription("Sends an anonymous message")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("Enter a message to respond with.")
      .setMinLength(1)
      .setMaxLength(2000)
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const message = interaction.options.getString("message");

  const user = interaction.guild?.members.cache.get(interaction.user.id);

  if (!user?.permissions.has([PermissionsBitField.Flags.ManageMessages])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  if (!message) {
    return interaction.reply({
      ephemeral: true,
      content: "Message data error",
    });
  }
  (interaction.channel as TextChannel)?.send(message);

  return interaction.reply({
    ephemeral: true,
    content: "Sent!",
  });
});
