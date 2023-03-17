import { useQueue } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { command, embed } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("pause")
  .setDescription("Pause/unpause a song");

export default command(meta, async ({ interaction }) => {
  const user = interaction.guild?.members.cache.get(interaction.user.id);

  if (!user?.voice.channel) {
    return interaction.reply({
      ephemeral: true,
      content: `You must be in a voice channel to use this command`,
    });
  }
  const queue = useQueue(interaction.guild?.id!);

  if (!queue?.currentTrack) {
    return interaction.reply({
      ephemeral: true,
      content: `There is not queue, so you can't pause track`,
    });
  }

  queue?.node.setPaused(!queue.node.isPaused());

  return interaction.reply({
    embeds: [
      embed({
        title: `Music ${queue?.node.isPaused() ? "paused" : "unpaused"}`,
        description: `by ${user}`,
      }),
    ],
  });
});
