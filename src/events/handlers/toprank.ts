import { CustomId } from "./../../utils/ID";
import { embed } from "../../utils/embed";
import { Colors, event } from "../../utils";
import models from "../../models";
import { ActionRowBuilder, ButtonBuilder } from "discord.js";
const { ranks } = models;

export default event("interactionCreate", async ({ log }, client) => {
  if (client.isButton()) {
    const id = client.customId;
    const gid = client.guild?.id;

    if (id === CustomId.rankVoice) {
      const response = await ranks.find({ gid }).sort("voice").limit(10);
      let desc = ``;

      for (let model of response) {
        const user = client.guild?.members.cache.get(model.uid);
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

      client.message.delete();

      return client.reply({
        embeds: [
          embed({
            color: Colors.success,
            title: "Top by voices",
            description: desc,
          }),
        ],
        components: [menu],
      });
    }
    if (id === CustomId.rankMessage) {
      const response = await ranks.find({ gid }).sort("messages").limit(10);
      let desc = ``;

      for (let model of response) {
        const user = client.guild?.members.cache.get(model.uid);
        desc += `\n${user} - ${Math.round(
          (model.messagesLength * model.messages) / 3
        )}`;
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

      client.message.delete();

      return client.reply({
        embeds: [
          embed({
            color: Colors.success,
            title: "Top by messages",
            description: desc,
          }),
        ],
        components: [menu],
      });
    }
  }
});
