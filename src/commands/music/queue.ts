import { useQueue } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { command, embed } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Shows a queue of songs");

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
          title: "Music queue",
          description: "Queue is empty",
        }),
      ],
    });
  }

  let desc = ``;
  let counter = 1;

  for (let song of queue.tracks.toArray()) {
    desc += `\n${counter} ${song.title}`;
    counter++;
  }
  return interaction.reply({
    embeds: [
      embed({
        title: "Music queue",
        description: desc,
      }),
    ],
  });
});
