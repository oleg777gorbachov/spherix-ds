import {
  Channel,
  ChannelType,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { command } from "../../utils";
import models from "../../models";
const { notification } = models;

const meta = new SlashCommandBuilder()
  .setName("youtube-channel")
  .setDescription("Sets notification channel for YouTube notification")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("Text channel for logging data")
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const channel = interaction.options.getChannel("channel") as Channel;

  const userExec = interaction.guild?.members.cache.get(interaction.user.id);

  if (!userExec?.permissions.has([PermissionsBitField.Flags.ManageChannels])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  if (channel?.type !== ChannelType.GuildText) {
    return interaction.reply({
      ephemeral: true,
      content: `Type of channel incorrect`,
    });
  }

  const gid = interaction.guild?.id;

  const isExist = await notification.findOne({ gid });
  if (isExist) {
    isExist.channelYoutube = channel.id;
    await isExist.save();
  } else {
    await new notification({
      channelTwitch: interaction.channelId,
      channelYoutube: interaction.channelId,
      gid,
      twitch: [],
      youtube: [],
      messageTwitch: "@here LINK went live",
      messageYoutube: `@here new video from NAME LINK`,
      etags: [],
      live: [],
    }).save();
  }

  return interaction.reply({
    ephemeral: true,
    content: `${channel} set as a logging youtube channels`,
  });
});
