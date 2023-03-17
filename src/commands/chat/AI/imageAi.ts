import { SlashCommandBuilder, TextChannel } from "discord.js";
import { Colors, command, embed, OpenAi } from "../../../utils";

const meta = new SlashCommandBuilder()
  .setName("image-generate")
  .setDescription("Generates an image by OpenAi")
  .addStringOption((option) =>
    option
      .setName("describe")
      .setDescription("Describe message")
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const question = interaction.options.getString("describe") as string;

  try {
    OpenAi.createImage({
      prompt: question,
      n: 1,
      size: "1024x1024",
    }).then((req) => {
      const data = req.data.data[0].url as string;
      return (interaction.channel as TextChannel).send({
        embeds: [
          embed({
            title: `Image - ${question}`,
            image: {
              url: data,
            },
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
