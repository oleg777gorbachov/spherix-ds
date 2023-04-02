import { SlashCommandBuilder } from "discord.js";
import { command, embed, stringSplit } from "../../utils";
import { useQueue } from "discord-player";
import models from "../../models";
const { music } = models;

const meta = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skips current song");

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

  const Track = queue?.currentTrack;

  if (!Track) {
    return interaction.reply({
      ephemeral: true,
      content: "Queue empty",
    });
  }
  queue.node.skip();

  return interaction.reply({
    embeds: [
      embed({
        title: "🎵 Music skipped",
        description: `Track ${Track.title} skipped\n${Track.url}`,
        footer: {
          text: `by ${interaction.user.tag}`,
        },
      }),
    ],
  });
});
