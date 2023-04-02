import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { Colors, command, embed, replacer } from "../../utils";
import models from "../../models";
const { notification } = models;

const meta = new SlashCommandBuilder()
  .setName("youtube-message")
  .setDescription("Sets a notification message for your YouTube notification")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("Your message {LINK - link, NAME - channel name}")
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

  isExist.messageYoutube = message;
  await isExist.save();

  const replaced = replacer(message, [
    {
      label: "LINK",
      value: "https://www.youtube.com/@xQcOW",
    },
    {
      label: "NAME",
      value: "xQc",
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
