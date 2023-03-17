import { useQueue } from "discord-player";
import {
  Client,
  SlashCommandBuilder,
  TextBasedChannel,
  TextChannel,
} from "discord.js";
import { command, embed } from "../../utils";
import { player } from "./player";

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
    interaction.channel!
  );

  (interaction.channel as TextChannel).send({
    embeds: [
      embed({
        title: "Music",
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
  channel: TextChannel | TextBasedChannel
) {
  const Player = await player(client);

  Player.options.smoothVolume = true;

  const { track } = await Player.play("637919095509090304", search, {
    searchEngine: "auto",
    fallbackSearchEngine: "youtube",
    nodeOptions: { metadata: channel },
  });

  const { title, url } = track;

  Player.on("error", (error) => {
    console.log(`Error: ${error}`);
    Player.destroy();
  });

  Player.events.on("playerStart", (queue, track) => {
    (queue.metadata as TextChannel).send({
      embeds: [
        embed({
          title: "Now playing",
          description: `Now playing - ${track.title}\n${track.url}`,
        }),
      ],
    });
  });

  return { title, url };
}
