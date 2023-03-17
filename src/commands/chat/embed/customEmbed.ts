import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { command } from "../../../utils";

const meta = new SlashCommandBuilder()
  .setName("embed-custom")
  .setDescription("Makes your custom embed from JSON (embed builders)")
  .addStringOption((option) =>
    option
      .setName("json")
      .setDescription("Your josn to embed")
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const json = interaction.options.getString("json") as string;

  const user = interaction.guild?.members.cache.get(interaction.user.id);

  if (!user?.permissions.has([PermissionsBitField.Flags.ManageMessages])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  let parse;
  try {
    parse = await JSON.parse(json);
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: "Wrong json",
    });
  }

  return interaction.reply({
    embeds: [{ ...parse }],
  });
});
