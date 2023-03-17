import { SlashCommandBuilder, TextChannel } from "discord.js";
import { Colors, command, embed, OpenAi } from "../../../utils";

const meta = new SlashCommandBuilder()
  .setName("ask")
  .setDescription("Ask a large language model your question")
  .addStringOption((option) =>
    option.setName("question").setDescription("Your question").setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const question = interaction.options.getString("question");

  try {
    OpenAi.createCompletion({
      model: "text-davinci-003",
      prompt: question,
      temperature: 0.3,
      max_tokens: 500,
      frequency_penalty: 0,
      presence_penalty: 0,
    }).then((req) => {
      const data = req.data;
      return (interaction.channel as TextChannel).send({
        embeds: [
          embed({
            title: question!,
            description: data.choices[0].text!,
            color: Colors.random(),
          }),
        ],
      });
    });
  } catch (error) {
    return (interaction.channel as TextChannel).send({
      content: `Api don't working, try later.`,
    });
  }

  return interaction.reply({
    ephemeral: true,
    content: `Please wait api working...`,
  });
});
