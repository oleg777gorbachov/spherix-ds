import { SlashCommandBuilder } from "discord.js";
import { Colors, command, embed, premCheck, stringSplit } from "../../utils";
import models from "../../models";
const { music } = models;

const meta = new SlashCommandBuilder()
  .setName("play-channel-remove")
  .setDescription("Removes your channel settings for music");

export default command(meta, async ({ interaction }) => {
  const gid = interaction.guild?.id;

  const check = await premCheck(interaction);
  if (!check) return;

  const model = await music.findOne({ gid });
  if (!model) {
    return interaction.reply({
      embeds: [
        embed({
          title: `🎵 Music`,
          description: stringSplit([
            `I can't find your music setting`,
            `So they already deleted`,
          ]),
        }),
      ],
    });
  }

  await model.deleteOne();

  return interaction.reply({
    embeds: [
      embed({
        title: `🎵 Music`,
        description: `Your music settings has been deleted`,
        color: Colors.success,
      }),
    ],
  });
});
