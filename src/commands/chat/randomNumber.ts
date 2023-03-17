import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("random-number")
  .setDescription("Sends a random number")
  .addNumberOption((option) =>
    option
      .setName("max-num")
      .setDescription("Max number (default 1)")
      .setRequired(false)
  );

export default command(meta, async ({ interaction }) => {
  const maxNum = interaction.options.getNumber("max-num") || 1;

  return interaction
    .reply({
      content: `Your number is ...`,
      fetchReply: true,
    })
    .then((e) =>
      setTimeout(
        () =>
          e.edit({
            content: `Your number is ${Math.round(Math.random() * maxNum)}`,
          }),
        333
      )
    );
});
