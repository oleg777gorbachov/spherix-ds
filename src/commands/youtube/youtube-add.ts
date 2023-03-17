import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { channelName, Colors, command, embed } from "../../utils";
import models from "../../models";
const { notification } = models;

const meta = new SlashCommandBuilder()
  .setName("youtube-add")
  .setDescription("Adds YouTube channel to your notification list")
  .addStringOption((option) =>
    option
      .setName("youtube_id")
      .setDescription("Provide channel id (NOT USER ID)")
      .setMinLength(1)
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const id = interaction.options.getString("youtube_id") as string;

  const userExec = interaction.guild?.members.cache.get(interaction.user.id);

  if (!userExec?.permissions.has([PermissionsBitField.Flags.ManageChannels])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  let response;

  try {
    const data = await channelName(id);
    if (data === undefined || !data.state) {
      return interaction.reply({
        ephemeral: true,
        content: "This channel don't exist",
      });
    }
    response = data;
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: "This channel don't exist",
    });
  }

  const gid = interaction.guild?.id;

  const isExist = await notification.findOne({ gid });
  if (isExist) {
    if (isExist.youtube.includes(id)) {
      return interaction.reply({
        ephemeral: true,
        content: "Channel already in list",
      });
    }
    isExist.youtube.push(id);
    await isExist.save();
  } else {
    await new notification({
      channelTwitch: interaction.channelId,
      channelYoutube: interaction.channelId,
      gid,
      twitch: [],
      youtube: [id],
      messageTwitch: "@here LINK went live",
      messageYoutube: `@here new video from NAME LINK`,
      etags: [],
      live: [],
    }).save();
    return interaction.reply({
      ephemeral: true,
      content: `${interaction.channel} set as a notification channel\n${response.name} notification added`,
    });
  }

  return interaction.reply({
    embeds: [
      embed({
        color: Colors.youtube,
        title: "Youtube notification",
        description: `${response.name} has been added`,
      }),
    ],
  });
});
