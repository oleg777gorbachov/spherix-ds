import {
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("slowmode")
  .setDescription("Sets a timeout to every message in chat")
  .addNumberOption((option) =>
    option
      .setName("number")
      .setDescription("Provide a timeout")
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  let number = interaction.options.getNumber("number");

  const user = interaction.guild?.members.cache.get(interaction.user.id);

  if (!user?.permissions.has([PermissionsBitField.Flags.ManageChannels])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  if (!number && number !== 0) {
    return interaction.reply({
      ephemeral: true,
      content: `Don't valid number!`,
    });
  }

  (interaction.channel as TextChannel).setRateLimitPerUser(number);

  if (number === 0) {
    return interaction.reply({
      ephemeral: true,
      content: `Slowmode mode off`,
    });
  }

  return interaction.reply({
    ephemeral: true,
    content: `Slowmode mode on, ${number} timeout`,
  });
});
