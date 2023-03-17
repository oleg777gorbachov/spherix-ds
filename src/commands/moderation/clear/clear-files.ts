import {
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { command, fetchMessages } from "../../../utils";

const meta = new SlashCommandBuilder()
  .setName("clear-files")
  .setDescription("Clears messages with any files")
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

  const allMessages = await fetchMessages(
    interaction.channel as TextChannel,
    20
  );

  const messages = allMessages.filter((e) => {
    if (e.attachments.size > 0) {
      const images = [".png", ".jpeg", ".jpg", ".gif", ".svg", ".webp"];
      const state = e.attachments.every((att) =>
        images.map((e) => att.url.includes(e)).includes(true)
      );
      if (state === false) {
        return true;
      }
      return false;
    }
  });

  let counter = -1;
  const { size } = await (interaction.channel as TextChannel).bulkDelete(
    messages.filter((m) => {
      counter++;
      return counter < number;
    }),
    true
  );

  if (size === 0) {
    return interaction.reply({
      ephemeral: true,
      content: `Can't find any messages with attachments!`,
    });
  }

  return interaction
    .reply({
      content: `Cleared ${size} messages with attachments!`,
      fetchReply: true,
    })
    .then((message) =>
      setTimeout(() => (message ? message.delete() : null), 3000)
    );
});
