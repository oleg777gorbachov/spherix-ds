import {
  EmbedAssetData,
  EmbedBuilder,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { command } from "../../utils";
import fetch from "node-fetch";

const meta = new SlashCommandBuilder()
  .setName("random-image")
  .setDescription("Sends a random image");

export default command(meta, async ({ interaction }) => {
  const api1 = "https://random.imagecdn.app/500/500";
  const api2 = "https://source.unsplash.com/random";
  try {
    fetch(api1).then((e) => {
      const img: EmbedAssetData = {
        url: e.url,
      };
      return (interaction.channel as TextChannel).send({
        embeds: [new EmbedBuilder({ image: img })],
      });
    });
  } catch (error) {
    return (interaction.channel as TextChannel).send({
      content: "Api error, try later.",
    });
  }

  return interaction
    .reply({
      content: `Loading...`,
      fetchReply: true,
    })
    .then((e) => setTimeout(() => e.delete(), 2000));
});
