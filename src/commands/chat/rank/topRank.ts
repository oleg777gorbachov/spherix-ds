import {
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Colors, command, embed, CustomId } from "../../../utils";
import models from "../../../models";
const { ranks } = models;

const meta = new SlashCommandBuilder()
  .setName("top-rank")
  .setDescription("Shows top ranks of the server");

export default command(meta, async ({ interaction }) => {
  const gid = interaction.guild?.id;
  const response = await ranks.find({ gid }).sort("voice").limit(10);

  let desc = ``;

  for (let model of response) {
    const user = interaction.guild?.members.cache.get(model.uid);
    desc += `\n${user} - ${(model.voice / 1000).toFixed(0)}`;
  }
  if (response.length === 0) {
    desc += "Empty";
  }

  const menu: ActionRowBuilder<any> = new ActionRowBuilder().setComponents(
    new ButtonBuilder()
      .setCustomId(CustomId.rankVoice)
      .setLabel("By voice")
      .setStyle(3),
    new ButtonBuilder()
      .setCustomId(CustomId.rankMessage)
      .setLabel("By messages")
      .setStyle(3)
  );

  return interaction.reply({
    embeds: [
      embed({
        color: Colors.success,
        title: "Top by voices",
        description: desc,
      }),
    ],
    components: [menu],
  });
});
