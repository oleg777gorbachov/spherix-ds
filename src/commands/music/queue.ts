import { useQueue } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { command, embed, stringSplit } from "../../utils";
import models from "../../models";
const { music } = models;

const meta = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Shows a queue of songs");

export default command(meta, async ({ interaction }) => {
  const user = interaction.guild?.members.cache.get(interaction.user.id);

  const gid = interaction.guildId;

  const model = await music.findOne({ gid });

  if (model) {
    if (interaction.channelId !== model.channelId) {
      const channel = interaction.guild?.channels.cache.get(model.channelId);
      return interaction.reply({
        ephemeral: true,
        content: stringSplit([
          `This channel is not for music`,
          `${channel} - for music`,
        ]),
      });
    }
  }

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
          title: "🎵 Music queue",
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
        title: "🎵 Music queue",
        description: desc,
      }),
    ],
  });
});
