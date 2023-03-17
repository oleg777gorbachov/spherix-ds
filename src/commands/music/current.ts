import { useQueue } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { command, embed } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("current")
  .setDescription("Shows current song");

export default command(meta, async ({ interaction }) => {
  const user = interaction.guild?.members.cache.get(interaction.user.id);

  if (!user?.voice.channel) {
    return interaction.reply({
      ephemeral: true,
      content: `You must be in a voice channel to use this command`,
    });
  }
  const queue = useQueue(interaction.guild?.id!);

  if (!queue) {
    return interaction.reply({
      embeds: [
        embed({
          title: "Music",
          description: "Queue is empty",
        }),
      ],
    });
  }

  return interaction.reply({
    embeds: [
      embed({
        title: "Music current",
        description: `Current song - ${queue.currentTrack?.title}\n${queue.currentTrack?.url}`,
      }),
    ],
  });
});
