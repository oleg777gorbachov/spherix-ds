import { embed } from "../../utils/embed";
import { CustomId, event, help, helpDesc, helpMenu } from "../../utils";
import { APIButtonComponent } from "discord.js";

export default event("interactionCreate", async ({ log }, client) => {
  if (client.isButton()) {
    if (client.customId === CustomId.helpNext) {
      const component = client.message.components[0].components[2]
        .data as Readonly<APIButtonComponent>;
      const label = component.label;
      if (!label) return;

      const page = +label[0] + 1;

      await client.message.edit({
        embeds: [
          embed({
            title: "Help",
            description: helpDesc(page),
          }),
        ],
        components: [helpMenu(page)],
      });

      await client.deferReply();
      await client.deleteReply();
    }

    if (client.customId === CustomId.helpPrev) {
      const component = client.message.components[0].components[2]
        .data as Readonly<APIButtonComponent>;
      const label = component.label;
      if (!label) return;

      const page = +label[0] - 1;

      await client.message.edit({
        embeds: [
          embed({
            title: "Help",
            description: helpDesc(page),
          }),
        ],
        components: [helpMenu(page)],
      });

      await client.deferReply();
      await client.deleteReply();
    }

    if (client.customId === CustomId.helpEnd) {
      const page = Math.ceil(help.length / 10);

      await client.message.edit({
        embeds: [
          embed({
            title: "Help",
            description: helpDesc(page),
          }),
        ],
        components: [helpMenu(page)],
      });

      await client.deferReply();
      await client.deleteReply();
    }

    if (client.customId === CustomId.helpFirst) {
      const page = 1;

      await client.message.edit({
        embeds: [
          embed({
            title: "Help",
            description: helpDesc(page),
          }),
        ],
        components: [helpMenu(page)],
      });

      await client.deferReply();
      await client.deleteReply();
    }
  }
});
