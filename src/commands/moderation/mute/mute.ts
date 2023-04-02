import {
  ChannelType,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
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

const { punishment, modChannel } = models;

const meta = new SlashCommandBuilder()
  .setName("mute")
  .setDescription("Mute a user")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("Provide a username")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("timeout")
      .setDescription("Time to mute user (1y, 1m, 1w, 1d, 1min, 1s)")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Provide a reason to mute user")
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
  time = numTime;

  const gid = interaction.guild?.id;
  const uid = user?.id;
  const expires = new Date().getTime() + time * 1000;

  let muteRole = interaction.guild?.roles.cache.find((role) =>
    role.name.toLowerCase().includes("muted" || "mute")
  );
  const userToMute = interaction.guild?.members.cache.get(user?.id || "");

  if (!muteRole) {
    muteRole = await interaction.guild?.roles.create({
      color: Colors.gray,
      name: "muted",
      reason: "Users that's cannot write in chat",
    });
    interaction.guild?.channels.cache.forEach(async (channel) => {
      if (channel.isTextBased()) {
        await (channel as TextChannel).permissionOverwrites.edit(muteRole!, {
          SendMessages: false,
          AddReactions: false,
          AttachFiles: false,
          CreatePublicThreads: false,
          CreatePrivateThreads: false,
          EmbedLinks: false,
          SendMessagesInThreads: false,
        });
      }
    });
  }

  if (!gid || !uid || !userToMute || !mod || !time || !reason || !muteRole) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong data`,
    });
  }

  try {
    await userToMute.timeout(null, reason);
    await userToMute.roles.add(muteRole);
    await DM(
      interaction,
      {
        embeds: [
          embed({
            title: "🤐 Muted",
            description: `You're muted by ${
              mod.user.tag
            }\nReason: ${reason}\nTime ${numToTime(time)}`,
            footer: {
              icon_url: interaction.guild?.iconURL()!,
              text: `${interaction.guild?.name}`,
            },
          }),
        ],
      },
      userToMute
    );
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content:
        "❌ I cannot mute that user, check user permission or bot permission",
    });
  }

  const description = stringSplit([
    `${userToMute} has been muted for **${numToTime(time)}**.`,
    `Reason: **${reason}**`,
  ]);
  const modModel = await modChannel.findOne({ gid });

  if (modModel) {
    const channel = interaction.guild.channels.cache.get(modModel.channelId);
    if (channel && channel.type === ChannelType.GuildText) {
      await channel.send({
        embeds: [
          embed({
            title: "🤐 Mute",
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

  let punish = await punishment.findOne({ gid, uid, type: "mute" });
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
      type: "mute",
    }).save();
  }

  return interaction
    .reply({
      embeds: [
        embed({
          title: "🤐 Mute",
          description,
          footer: {
            text: `by ${mod.displayName}`,
          },
        }),
      ],
      fetchReply: true,
    })
    .then((message) =>
      setTimeout(async () => {
        const id = punish!._id;
        await punishment.findOneAndDelete({ _id: id });
        userToMute.roles.remove(muteRole!);
        if (message) {
          message.edit({
            embeds: [
              embed({
                title: "😀 Unmute",
                color: Colors.success,
                description,
                footer: {
                  text: `by ${mod.displayName}\nAlready unmuted.`,
                },
              }),
            ],
          });
        }
      }, +time * 1000)
    );
});
