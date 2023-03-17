import {
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { command } from "../../../utils";

const meta = new SlashCommandBuilder()
  .setName("clear")
  .setDescription("Clears a last nth messages")
  .addNumberOption((option) =>
    option
      .setName("number")
      .setDescription("How many messages to clear? (Max 30)")
      .setRequired(false)
  );

export default command(meta, async ({ interaction }) => {
  let number = interaction.options.getNumber("number") || 1;

  const user = interaction.guild?.members.cache.get(interaction.user.id);

  if (!user?.permissions.has([PermissionsBitField.Flags.ManageMessages])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  if (+number > 30) {
    number = 30;
  }

  const { size } = await (interaction.channel as TextChannel).bulkDelete(
    number,
    true
  );

  return interaction
    .reply({
      content: `Cleared ${size} messages!`,
      fetchReply: true,
    })
    .then((message) =>
      setTimeout(() => (message ? message.delete() : null), 3000)
    );
});
