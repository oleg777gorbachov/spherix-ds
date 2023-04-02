import { SlashCommandBuilder } from "discord.js";
import { Colors, command, embed, stringSplit } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("help-notification")
  .setDescription("Gives a list of commands");

export default command(meta, async ({ interaction }) => {
  return interaction.reply({
    ephemeral: true,
    embeds: [
      embed({
        title: "🔔 Notification help",
        description: stringSplit([
          `!off [gid] - off notification from guild`,
          `!on [gid] - allow notification from guild`,
          `!all-off - off all notification`,
          `!all-on - on all notification`,
          `!list - shows list of your notification`,
        ]),
        color: Colors.white,
      }),
    ],
  });
});
