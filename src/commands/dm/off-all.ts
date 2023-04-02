import { Guild, SlashCommandBuilder } from "discord.js";
import { Colors, command, embed } from "../../utils";
import models from "../../models";
const { ignore } = models;

const meta = new SlashCommandBuilder()
  .setName("off-all")
  .setDescription("Mute all notification");

export default command(meta, async ({ interaction }) => {
  const uid = interaction.user.id;

  const model = await ignore.findOne({ uid });

  if (!model) {
    await new ignore({
      uid,
      isAll: true,
    }).save();
    return interaction.reply({
      ephemeral: true,
      embeds: [
        embed({
          title: "🔔 Notification",
          description: `You're muted all notification\nFrom now bot will not send you messages`,
          color: Colors.success,
        }),
      ],
    });
  }

  model.isAll = true;
  await model.save();
  return interaction.reply({
    ephemeral: true,
    embeds: [
      embed({
        title: "🔔 Notification",
        description: `You're muted all notification\nFrom now bot will not send you messages`,
        color: Colors.success,
      }),
    ],
  });
});
