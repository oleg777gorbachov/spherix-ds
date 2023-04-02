import {
  ChannelType,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import models from "../../../models";
import {
  Colors,
  command,
  embed,
  numToTime,
  stringSplit,
  timeConvert,
} from "../../../utils";
const { punishment, modChannel } = models;

const meta = new SlashCommandBuilder()
  .setName("timeout")
  .setDescription("Hard mutes a user (timeout)")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("Provide a username")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("timeout")
      .setDescription("Time to timeout user (20s, 1min, 1h, 1d ...etc)")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Provide a reason to timeout user")
      .setMinLength(1)
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const user = interaction.options.getUser("user");
  let time: string | number = interaction.options.getString(
    "timeout"
  ) as string;
  const reason = interaction.options.getString("reason");

  const modId = interaction.user.id;
  const mod = interaction.guild?.members.cache.get(modId);

  if (!mod?.permissions.has([PermissionsBitField.Flags.MuteMembers])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const numTime = timeConvert(time);
  if (numTime === undefined) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong parametrs`,
    });
  }
  const d28 = timeConvert("28d");
  if (d28 && numTime > d28) {
    time = d28;
  } else {
    time = numTime;
  }

  const gid = interaction.guild?.id;
  const uid = user?.id;
  const expires = new Date().getTime() + time * 1000;

  const userToMute = interaction.guild?.members.cache.get(user?.id!);

  if (!gid || !uid || !userToMute || !mod || !time || !reason) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong data`,
    });
  }

  try {
    await userToMute.timeout(time * 1000, reason);
  } catch (error) {
    console.log(error);
    return interaction.reply({
      ephemeral: true,
      content: "I cannot timeout that user",
    });
  }

  const description = stringSplit([
    `${userToMute} has been timeoted for **${numToTime(time)}**`,
    `Reason: **${reason}**`,
  ]);
  const title = "⛔ Timeout";

  const modModel = await modChannel.findOne({ gid });

  if (modModel) {
    const channel = interaction.guild.channels.cache.get(modModel.channelId);
    if (channel && channel.type === ChannelType.GuildText) {
      await channel.send({
        embeds: [
          embed({
            title,
            description,
            color: Colors.white,
            thumbnail: {
              url: mod.displayAvatarURL(),
            },
            footer: {
              text: `id: ${mod.id} | by ${mod.user.tag}`,
            },
          }),
        ],
      });
    }
  }

  let punish = await punishment.findOne({ gid, uid, type: "timeout" });
  if (punish) {
    punish.reason = reason;
    punish.expires = expires;
    punish.modId = modId;
    await punish.save();
  } else {
    punish = await new punishment({
      expires,
      gid,
      modId,
      reason,
      uid,
      type: "timeout",
    }).save();
  }

  return interaction
    .reply({
      embeds: [
        embed({
          title,
          description,
          footer: {
            text: `by ${mod.displayName}`,
          },
        }),
      ],
      fetchReply: true,
    })
    .then(() =>
      setTimeout(async () => {
        const id = punish!._id;
        await punishment.findOneAndDelete({ _id: id });
      }, +time * 1000)
    );
});
