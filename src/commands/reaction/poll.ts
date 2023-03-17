import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("poll")
  .setDescription("Create a poll for a question and its multiple choices")
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("Enter question")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("choices")
      .setDescription("Enter your choices separated by , or |")
      .setMinLength(3)
      .setRequired(true)
  );

const numToEmoji = {
  1: "\u0031\u20E3",
  2: "\u0032\u20E3",
  3: "\u0033\u20E3",
  4: "\u0034\u20E3",
  5: "\u0035\u20E3",
  6: "\u0036\u20E3",
  7: "\u0037\u20E3",
  8: "\u0038\u20E3",
  9: "\u0039\u20E3",
  10: "\uD83D\uDD1F",
};

export default command(meta, async ({ interaction }) => {
  const question = interaction.options.getString("question") as string;
  const choices = interaction.options.getString("choices") as string;

  let arr: string[];
  if (choices.includes(",")) {
    arr = choices.split(",");
  } else {
    arr = choices.split("|");
  }

  if (arr.length < 2) {
    return interaction.reply({
      ephemeral: true,
      content: `Minimum 2 choices`,
    });
  }

  if (arr.length > 10) {
    return interaction.reply({
      ephemeral: true,
      content: `Maximum 10 choices`,
    });
  }

  return interaction
    .reply({
      content: `${interaction.user.username} asks: ${question}\n${arr.map(
        (e, i) =>
          `\n${numToEmoji[(i + 1) as keyof typeof numToEmoji]} ${
            i === arr.length - 1 ? e : e.substring(0, e.length - 1)
          }`
      )}`,
      fetchReply: true,
    })
    .then((e) =>
      arr.map((_, i) => e.react(numToEmoji[(i + 1) as keyof typeof numToEmoji]))
    );
});
