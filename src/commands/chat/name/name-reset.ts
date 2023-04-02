import { GuildMember, SlashCommandBuilder } from "discord.js";
import { command } from "../../../utils";

const meta = new SlashCommandBuilder()
  .setName("name-reset")
  .setDescription("Resets your name");

export default command(meta, async ({ interaction }) => {
  const user = interaction.guild?.members.cache.get(
    interaction.user.id
  ) as GuildMember;

  try {
    await user.setNickname(
      interaction.user.tag.slice(0, interaction.user.tag.length - 5)
    );
  } catch (err) {
    return interaction.reply({
      ephemeral: true,
      content: "Something went wrong",
    });
  }

  return interaction.reply({
    ephemeral: true,
    content: `You reset your nickname to **${interaction.user.tag.slice(
      0,
      interaction.user.tag.length - 5
    )}**!`,
  });
});
