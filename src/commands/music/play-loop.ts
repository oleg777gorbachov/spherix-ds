import { useQueue } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { command, embed, premCheck, stringSplit } from "../../utils";
import models from "../../models";
const { music } = models;

const meta = new SlashCommandBuilder()
  .setName("play-mode")
  .setDescription("Chooses the mode to play your music")
  .addNumberOption((option) =>
    option
      .setName("state")
      .setDescription(
        "0 Default mode; 1 Loops the current track; 2 Loops the current queue; 3 - Play related songs"
      )
      .setMinValue(0)
      .setMaxValue(3)
      .setRequired(false)
  );

export default command(meta, async ({ interaction }) => {
  let state = interaction.options.getNumber("state");
  const user = interaction.guild?.members.cache.get(interaction.user.id);

  const check = await premCheck(interaction);
  if (!check) return;

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

  if (!queue?.currentTrack) {
    return interaction.reply({
      ephemeral: true,
      content: `There is not queue, so you can't change any option`,
    });
  }

  const mode = state ? state : queue.repeatMode === 0 ? 1 : 0;
  queue?.setRepeatMode(mode);

  return interaction.reply({
    embeds: [
      embed({
        title: "🎵 Music loopping",
        description: `Music mode - ${
          mode === 0
            ? "Default"
            : mode === 1
            ? "Looping current track"
            : mode === 2
            ? "Looping the queue"
            : "Related tracks"
        }`,
        footer: {
          text: `by ${interaction.user.tag}`,
        },
      }),
    ],
  });
});
