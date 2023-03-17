import { TextChannel } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import { Colors, command, embed, timeConvert } from "../../utils";

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
  const timeout = interaction.options.getString("timeout");
  const message = interaction.options.getString("message");

  return interaction
    .reply({
      ephemeral: true,
      content: `Reminder will be showed after ${timeConvert(timeout!)} seconds`,
    })
    .then(() =>
      setTimeout(
        () =>
          (interaction.channel as TextChannel).send({
            content: `${interaction.user}`,
            embeds: [
              embed({
                color: Colors.success,
                title: "Your remind",
                description: message!,
              }),
            ],
          }),
        timeConvert(timeout!) * 1000
      )
    );
});
