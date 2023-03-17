import { SlashCommandBuilder } from "discord.js";
import fetch from "node-fetch";
import Keys from "../../../keys";
import { Colors, command, embed } from "../../../utils";

const meta = new SlashCommandBuilder()
  .setName("fact")
  .setDescription("Gives you a random fact");

export default command(meta, async ({ interaction }) => {
  const response = await fetch("https://api.api-ninjas.com/v1/facts?limit=1", {
    headers: {
      "X-Api-Key": Keys.ninja_api_key,
    },
  });
  const data = await response.json();

  return interaction.reply({
    embeds: [
      embed({
        title: `Random fact`,
        description: data[0].fact,
        color: Colors.random(),
      }),
    ],
  });
});
