import {
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { command, fetchMessages } from "../../../utils";

const meta = new SlashCommandBuilder()
  .setName("clear-user")
  .setDescription("Clears messages from certain user")
  .addUserOption((option) =>
    option.setName("user").setDescription("Enter username").setRequired(true)
  )
  .addNumberOption((option) =>
    option
      .setName("number")
      .setDescription("How many messages to clear? (Max 30)")
      .setRequired(false)
  );

export default command(meta, async ({ interaction }) => {
  let number = interaction.options.getNumber("number") || 1;
  const userClear = interaction.options.getUser("user");

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
  
  const messages = allMessages.filter((e) => e.author.id === userClear?.id);

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
      content: `Can't find any messages from user!`,
    });
  }

  return interaction
    .reply({
      content: `Cleared ${size} messages from ${userClear?.username}!`,
      fetchReply: true,
    })
    .then((message) =>
      setTimeout(() => (message ? message.delete() : null), 3000)
    );
});
