import { Colors } from "../../../utils/color/colors";
import {
  APIEmbedFooter,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { command, embed, isColor } from "../../../utils";

const meta = new SlashCommandBuilder()
  .setName("embed")
  .setDescription("Make embed message")
  .addStringOption((option) =>
    option
      .setName("title")
      .setDescription("Your title to embed message")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("description")
      .setDescription("Your description to embed message")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("footer")
      .setDescription("Your footer of embed message")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("color")
      .setDescription("Your color of embed message (default: 474d49)")
      .setMinLength(6)
      .setMaxLength(6)
      .setRequired(false)
  );

export default command(meta, async ({ interaction }) => {
  const title = interaction.options.getString("title");
  const desc = interaction.options.getString("description");
  const footer = interaction.options.getString("footer");
  let color: string | number = interaction.options.getString("color") || "";

  const user = interaction.guild?.members.cache.get(interaction.user.id);

  if (!user?.permissions.has([PermissionsBitField.Flags.ManageMessages])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  if (!title && !desc && !footer) {
    return interaction.reply({
      ephemeral: true,
      content: "Insufficient arguments",
    });
  }

  if (isColor(color)) {
    color = Colors.gray;
  }

  const footerApi: APIEmbedFooter = {
    text: footer || "",
  };

  return interaction.reply({
    embeds: [
      embed({
        color: +color,
        description: desc || "",
        title: title || "",
        footer: footerApi,
      }),
    ],
  });
});
