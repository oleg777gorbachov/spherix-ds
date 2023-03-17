import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { Colors, command, embed } from "../../utils";
import models from "../../models";
import Keys from "../../keys";
import TwitchApi from "node-twitch";
const { notification } = models;

const twitch = new TwitchApi({
  client_id: Keys.twitch_client_id,
  client_secret: Keys.twitch_client_secret,
});

const meta = new SlashCommandBuilder()
  .setName("twitch-add")
  .setDescription("Adds streamer to your notification list")
  .addStringOption((option) =>
    option
      .setName("twitch")
      .setDescription("Your twitch name")
      .setMinLength(1)
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const user = interaction.options.getString("twitch") as string;

  const userExec = interaction.guild?.members.cache.get(interaction.user.id);

  if (!userExec?.permissions.has([PermissionsBitField.Flags.ManageChannels])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }
  try {
    await twitch.getStreams({ channel: user! });
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: "This streamer don't exist",
    });
  }

  const gid = interaction.guild?.id;

  const isExist = await notification.findOne({ gid });
  if (isExist) {
    if (isExist.twitch.includes(user)) {
      return interaction.reply({
        ephemeral: true,
        content: `User already in notification list`,
      });
    }
    isExist.twitch.push(user);
    await isExist.save();
  } else {
    await new notification({
      channelTwitch: interaction.channelId,
      channelYoutube: interaction.channelId,
      gid,
      twitch: [user],
      youtube: [],
      messageTwitch: "@here LINK went live",
      messageYoutube: `@here new video from NAME LINK`,
      etags: [],
      live: [],
    }).save();
    return interaction.reply({
      ephemeral: true,
      content: `${interaction.channel} set as a notification channel\n${user} notification added`,
    });
  }

  return interaction.reply({
    embeds: [
      embed({
        color: Colors.twitch,
        title: "Streamer added",
        description: `${user} notification added`,
      }),
    ],
  });
});
