import { embed } from "../../utils/embed";
import { Colors, CustomId, event } from "../../utils";

export default event("interactionCreate", async ({ log }, client) => {
  if (client.isButton()) {
    const id = client.customId;

    if (id === CustomId.reportClose) {
      const desc = client.message.embeds[0].data.description;
      const title = client.message.embeds[0].data.title;
      const footer = client.message.embeds[0].data.footer;

      return client.message.edit({
        embeds: [
          embed({
            color: Colors.success,
            title: "(CLOSED) " + title,
            description: desc!,
            footer,
          }),
        ],
        components: [],
      });
    }
  }
});
