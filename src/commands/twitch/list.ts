import { SlashCommandBuilder } from "discord.js";
import { Colors, command, embed } from "../../utils";
import models from "../../models";
const { notification } = models;

const meta = new SlashCommandBuilder()
  .setName("twitch-list")
  .setDescription("Shows your notification list");

export default command(meta, async ({ interaction }) => {
  const gid = interaction.guild?.id;

  const isExist = await notification.findOne({ gid });

  if (!isExist || isExist.twitch.length === 0) {
    return interaction.reply({
      ephemeral: true,
      content: `You don't have any notification`,
    });
  }

  return interaction.reply({
    embeds: [
      embed({
        title: "Notification list",
        color: Colors.twitch,
        description: `${isExist.twitch
          .map((e, i) => `\n${i + 1} ${e}`)
          .join(" ")}`,
      }),
    ],
  });
});
