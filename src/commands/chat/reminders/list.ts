import { SlashCommandBuilder } from "discord.js";
import { Colors, command, numToTime, stringSplit, embed } from "../../../utils";
import models from "../../../models";
const { reminder } = models;

const meta = new SlashCommandBuilder()
  .setName("remind-list")
  .setDescription("Shows list of your reminders");

export default command(meta, async ({ interaction }) => {
  const uid = interaction.user.id;

  const model = await reminder.find({ uid }).limit(10);

  if (!model || model.length === 0) {
    return interaction.reply({
      ephemeral: true,
      embeds: [
        embed({
          title: "Your don't have any reminders",
        }),
      ],
    });
  }

  let desc: string[] = [];

  for (let key of model) {
    const diff = key.expires - new Date().getTime();
    desc.push(
      stringSplit([
        `**ID ${key.id}**`,
        `Reminder will be send in **${numToTime(diff / 1000)}**`,
      ])
    );
  }

  return interaction.reply({
    ephemeral: true,
    embeds: [
      embed({
        title: "Your reminders",
        description: stringSplit(desc),
        color: Colors.white,
      }),
    ],
  });
});
