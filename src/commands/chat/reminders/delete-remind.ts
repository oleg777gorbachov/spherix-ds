import { SlashCommandBuilder } from "discord.js";
import { Colors, command, embed } from "../../../utils";
import models from "../../../models";
const { reminder } = models;

const meta = new SlashCommandBuilder()
  .setName("remind-delete")
  .setDescription("Delete reminder")
  .addStringOption((option) =>
    option
      .setName("id")
      .setDescription("Enter your reminder id")
      .setMinLength(1)
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const id = interaction.options.getString("id");
  const uid = interaction.user.id;

  const model = await reminder.findOne({ uid, id });

  if (!model) {
    return interaction.reply({
      ephemeral: true,
      content: "I can't find reminder with this id",
    });
  }

  if (model.uid !== uid) {
    return interaction.reply({
      ephemeral: true,
      content: "You don't have permission to delete this one",
    });
  }

  await model.deleteOne();

  return interaction.reply({
    ephemeral: true,
    embeds: [
      embed({
        title: "Reminder deleted",
        color: Colors.success,
      }),
    ],
  });
});
