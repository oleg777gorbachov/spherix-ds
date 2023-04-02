import { GuildMember, SlashCommandBuilder } from "discord.js";
import { command } from "../../../utils";

const meta = new SlashCommandBuilder()
  .setName("name")
  .setDescription("Change your name in this server")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("Enter nickname")
      .setMinLength(1)
      .setMaxLength(2000)
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const name = interaction.options.getString("name");

  const user = interaction.guild?.members.cache.get(
    interaction.user.id
  ) as GuildMember;

  try {
    await user.setNickname(name);
  } catch (err) {
    console.log(err);
    return interaction.reply({
      ephemeral: true,
      content: "Something went wrong",
    });
  }

  return interaction.reply({
    ephemeral: true,
    content: `You changed your name to **${name}**!`,
  });
});
