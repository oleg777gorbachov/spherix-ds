import { useQueue } from "discord-player";
import {
  Client,
  SlashCommandBuilder,
  TextBasedChannel,
  TextChannel,
} from "discord.js";
import { command, embed, stringSplit } from "../../utils";
import { player } from "./player";
import models from "../../models";
const { music } = models;

const meta = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Add a song to queue")
  .addStringOption((option) =>
    option
      .setName("search")
      .setDescription("Searches for a song")
      .setMinLength(1)
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const search = interaction.options.getString("search") as string;

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

    if (user?.voice.channelId !== model.voiceId) {
      const channel = interaction.guild?.channels.cache.get(model.voiceId);
      return interaction.reply({
        ephemeral: true,
        content: stringSplit([
          `You must be in a voice channel to use this command`,
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
  await interaction.deferReply();
  await interaction.deleteReply();

  // const queue = useQueue(interaction.guild?.id!);
  // queue?.filters.ffmpeg.setFilters(["lofi", "8D", "fadein"]);

  const { title, url } = await playMusic(
    search,
    interaction.client,
    interaction.channel!,
    user.voice.channelId!
  );

  (interaction.channel as TextChannel).send({
    embeds: [
      embed({
        title: "☑️ Music",
        description: `Added to queue ${title}\n${url}`,
        footer: {
          text: `by ${interaction.user.tag}`,
        },
      }),
    ],
  });
});

async function playMusic(
  search: string,
  client: Client<boolean>,
  channel: TextChannel | TextBasedChannel,
  voiceChannel: string
) {
  const Player = await player(client);

  Player.options.smoothVolume = true;

  const { track } = await Player.play(voiceChannel, search, {
    searchEngine: "auto",
    fallbackSearchEngine: "youtube",
    nodeOptions: { metadata: channel },
  });

  const { title, url } = track;

  let isEnd = true;

  Player.on("error", (error) => {
    console.log(`Error: ${error}`);
    Player.destroy();
  });

  Player.events.on("playerStart", async (queue, track) => {
    if (isEnd) {
      isEnd = false;
      await (queue.metadata as TextChannel).send({
        embeds: [
          embed({
            title: "🎵 Now playing",
            description: `Now playing - ${track.title}\n${track.url}`,
          }),
        ],
      });
    }
  });

  Player.events.on("playerFinish", async () => {
    isEnd = true;
  });

  return { title, url };
}
