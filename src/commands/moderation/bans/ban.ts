import {
  APIEmbedFooter,
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
  unban,
  timeConvert,
} from "../../../utils";
import models from "../../../models";

const { punishment, modChannel } = models;

const meta = new SlashCommandBuilder()
  .setName("ban")
  .setDescription("Bans user")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("Provide a username")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Provide a reason to ban user")
      .setMinLength(1)
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("date")
      .setDescription("Write time (5m, 1h, 2d, 1m, 1y), by default eternal")
      .setRequired(false)
  );

export default command(meta, async ({ interaction }) => {
  const user = interaction.options.getUser("user");
  let time: string | number | undefined =
    interaction.options.getString("date") || "";
  const reason = interaction.options.getString("reason");

  const modId = interaction.user.id;
  const mod = interaction.guild?.members.cache.get(modId);
  const gid = interaction.guildId;

  if (!mod?.permissions.has([PermissionsBitField.Flags.BanMembers])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const numTime = timeConvert(time);
  if (time && numTime === undefined) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong parametrs`,
    });
  }
  time = numTime;

  const userToBan = interaction.guild?.members.cache.get(user?.id!);

  if (!userToBan || !mod || !reason || !user) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong data`,
    });
  }

  try {
    await userToBan.ban();
    await DM(
      interaction,
      {
        embeds: [
          embed({
            title: `🚫 You have been banned on ${interaction.guild?.name}`,
            description: stringSplit([
              `Reason: **${reason}**`,
              `by ${mod.user.tag}`,
              `If you wanna clarify information, contact to him`,
            ]),
            footer: {
              icon_url: interaction.guild?.iconURL()!,
              text: `${interaction.guild?.name}`,
            },
          }),
        ],
      },
      userToBan
    );
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: "I cannot ban that user",
    });
  }

  const title = "🚫 Ban";
  const description = stringSplit([
    `${userToBan} has been **banned**.`,
    `Reason: **${reason}**`,
    `Time: ${typeof time === "number" ? numToTime(time) : "until be unbanned"}`,
  ]);

  const modModel = await modChannel.findOne({ gid });

  if (modModel) {
    const channel = interaction.guild?.channels.cache.get(modModel.channelId);
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

  const punish = await new punishment({
    expires: time ? new Date().getTime() + time * 1000 : -1,
    uid: userToBan.user.id,
    modId,
    reason,
    gid: interaction.guild?.id,
    type: "ban",
  }).save();

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
    })
    .then(() => {
      if (time) {
        unban(interaction.guild!, punish);
      }
    });
});
