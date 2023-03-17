import { SlashCommandBuilder } from "discord.js";
import { Colors, command, embed } from "../../utils";
import models from "../../models";
const { notification } = models;

const meta = new SlashCommandBuilder()
  .setName("youtube-list")
  .setDescription("Shows yours youtube notification list");

export default command(meta, async ({ interaction }) => {
  const gid = interaction.guild?.id;

  const isExist = await notification.findOne({ gid });

  if (!isExist || isExist.youtube.length === 0) {
    return interaction.reply({
      ephemeral: true,
      content: `You don't have any youtube notification`,
    });
  }

  return interaction.reply({
    embeds: [
      embed({
        title: "Youtube notification list",
        color: Colors.youtube,
        description: `${isExist.youtube
          .map((e, i) => `\n${i + 1} ${e}`)
          .join(" ")}`,
      }),
    ],
  });
});
