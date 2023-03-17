import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Check bot latency");

export default command(meta, ({ interaction }) => {
  return interaction.reply({
    ephemeral: true,
    content: `🏓 | Latency is: **${
      Date.now() - interaction.createdTimestamp
    }ms.**`,
  });
});
