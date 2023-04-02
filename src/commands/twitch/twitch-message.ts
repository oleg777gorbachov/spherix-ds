import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { Colors, command, embed, replacer } from "../../utils";
import models from "../../models";
const { notification } = models;

const meta = new SlashCommandBuilder()
  .setName("twitch-message")
  .setDescription("Sets a notification message for your twitch notification")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("Your message {LINK - link, NAME - twtich name}")
      .setMinLength(1)
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const message = interaction.options.getString("message") as string;
  const gid = interaction.guild?.id;

  const userExec = interaction.guild?.members.cache.get(interaction.user.id);

  if (!userExec?.permissions.has([PermissionsBitField.Flags.ManageChannels])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const isExist = await notification.findOne({ gid });

  if (!isExist) {
    return interaction.reply({
      ephemeral: true,
      content: `You don't setup notification channel`,
    });
  }

  isExist.messageTwitch = message;
  await isExist.save();

  const replaced = replacer(message, [
    {
      label: "LINK",
      value: "https://www.twitch.tv/xqc",
    },
    {
      label: "NAME",
      value: "xqc",
    },
  ]);

  return interaction.reply({
    embeds: [
      embed({
        title: "Notification message",
        color: Colors.twitch,
        description: `${replaced}`,
      }),
    ],
  });
});
