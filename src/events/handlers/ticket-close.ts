import { embed } from "../../utils/embed";
import { Colors, CustomId, event } from "../../utils";

export default event("interactionCreate", async ({ log }, client) => {
  if (client.isButton()) {
    const id = client.customId;

    if (id === CustomId.ticketClose) {
      const desc = client.message.embeds[0].data.description;
      const title = client.message.embeds[0].data.title;
      return client.message.edit({
        embeds: [
          embed({
            color: Colors.success,
            title: "(CLOSED) " + title,
            description: desc!,
          }),
        ],
        components: [],
      });
    }
  }
});
