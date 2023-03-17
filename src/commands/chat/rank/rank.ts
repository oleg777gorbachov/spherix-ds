import { SlashCommandBuilder } from "discord.js";
import { Colors, command, embed } from "../../../utils";
import models from "../../../models";
const { ranks } = models;

const meta = new SlashCommandBuilder()
  .setName("rank")
  .setDescription("Shows your rank");

export default command(meta, async ({ interaction }) => {
  const gid = interaction.guild?.id;
  const uid = interaction.user.id;
  const response = await ranks.findOne({ gid, uid });

  if (!response) {
    return interaction.reply({
      ephemeral: true,
      content: "You don't any activity on this server",
    });
  }

  return interaction.reply({
    embeds: [
      embed({
        title: `${interaction.user.tag} rank`,
        description: `Voice - ${(response.voice / 1000).toFixed(
          0
        )} points\nMessage - ${Math.round(
          (response.messagesLength * response.messages) / 3
        )} points`,
        color: Colors.success,
      }),
    ],
  });
});
