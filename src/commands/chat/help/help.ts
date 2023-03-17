import { embed } from "./../../../utils/embed";
import { SlashCommandBuilder } from "discord.js";
import { command, helpDesc, helpMenu } from "../../../utils";

const meta = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Shows help for the bot");

export default command(meta, async ({ interaction }) => {
  return interaction.reply({
    embeds: [
      embed({
        title: "Help",
        description: helpDesc(1),
      }),
    ],
    fetchReply: true,
    components: [helpMenu(1)],
  });
});
