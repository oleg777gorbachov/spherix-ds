import { Guild, SlashCommandBuilder } from "discord.js";
import { Colors, command, embed } from "../../utils";
import models from "../../models";
const { ignore } = models;

const meta = new SlashCommandBuilder()
  .setName("on-all")
  .setDescription("Allows all notification");

export default command(meta, async ({ interaction }) => {
  const uid = interaction.user.id;

  const model = await ignore.findOne({ uid });

  if (!model) {
    await new ignore({
      uid,
      isAll: false,
    }).save();
    return interaction.reply({
      ephemeral: true,
      embeds: [
        embed({
          title: "🔔 Notification",
          description: `You're alowed all notification\nFrom now bot will send you messages`,
          color: Colors.success,
        }),
      ],
    });
  }

  model.isAll = false;
  await model.save();
  return interaction.reply({
    ephemeral: true,
    embeds: [
      embed({
        title: "🔔 Notification",
        description: `You're alowed all notification\nFrom now bot will send you messages`,
        color: Colors.success,
      }),
    ],
  });
});
