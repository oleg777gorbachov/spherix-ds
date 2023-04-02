import { SlashCommandBuilder } from "discord.js";
import {
  Colors,
  command,
  DM,
  embed,
  numToTime,
  stringSplit,
  timeConvert,
} from "../../../utils";
import models from "../../../models";
const { reminder } = models;

const meta = new SlashCommandBuilder()
  .setName("remind")
  .setDescription("Reminds you to do something after a certain time")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("Enter your message")
      .setMinLength(1)
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("timeout")
      .setDescription("After that time, your reminder will be displayed")
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  let timeout: number | string = interaction.options.getString(
    "timeout"
  ) as string;
  const message = interaction.options.getString("message");
  const uid = interaction.user.id;

  const numTime = timeConvert(timeout);
  if (numTime === undefined) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong parametrs`,
    });
  }
  timeout = numTime;

  const model = await reminder.findOne({ uid }).sort({ id: -1 });

  const remind = await new reminder({
    uid,
    expires: new Date().getTime() + numTime * 1000,
    message,
    id: model ? model.id + 1 : 1,
  }).save();

  return interaction
    .reply({
      ephemeral: true,
      embeds: [
        embed({
          title: "Reminds",
          description: stringSplit([
            `I will DM you after ${numToTime(timeout)}`,
            `Your remind **ID ${remind.id}**`,
          ]),
          color: Colors.success,
        }),
      ],
    })
    .then(() =>
      setTimeout(async () => {
        const model = await reminder.findOne({ uid, id: remind.id });
        if (!model) return;
        await reminder.findOne({ uid, id: remind.id }).deleteOne();
        await DM(
          interaction,
          {
            content: `${interaction.user}`,
            embeds: [
              embed({
                color: Colors.success,
                title: "Your remind",
                description: message!,
              }),
            ],
          },
          interaction.user,
          true
        );
      }, +timeout * 1000)
    );
});
