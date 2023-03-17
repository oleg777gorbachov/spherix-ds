import {
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { command, fetchMessages } from "../../../utils";

const meta = new SlashCommandBuilder()
  .setName("clear-contain")
  .setDescription("Clears messages with such contains")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("Message which should contain that string")
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option
      .setName("number")
      .setDescription("How many messages to clear? (Max 30)")
      .setRequired(false)
  );

export default command(meta, async ({ interaction }) => {
  let number = interaction.options.getNumber("number") || 1;
  const contain = interaction.options.getString("message") as string;

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

  const messages = allMessages.filter((e) =>
    e.content.toLowerCase().includes(contain.toLowerCase())
  );

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
      content: `Can't find any messages with that containment`,
    });
  }

  return interaction
    .reply({
      content: `Cleared ${size} bots messages!`,
      fetchReply: true,
    })
    .then((message) =>
      setTimeout(() => (message ? message.delete() : null), 3000)
    );
});
