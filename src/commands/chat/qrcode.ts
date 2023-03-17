import { SlashCommandBuilder } from "discord.js";
import { Colors, command, embed, isIncludeLink } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("qrcode")
  .setDescription("Generates a qr code")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("Enter your message")
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const message = interaction.options.getString("message") as string;

  const description = isIncludeLink(message)
    ? "**`Be careful qrcode includes link`**"
    : "";

  return interaction.reply({
    embeds: [
      embed({
        title: `${interaction.user.tag} generate qrcode`,
        description,
        image: {
          url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${message}`,
        },
        color: Colors.random(),
      }),
    ],
  });
});
