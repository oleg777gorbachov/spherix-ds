import {
  APIEmbedFooter,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { Colors, command, embed, timeConvert } from "../../../utils";
import models from "../../../models";

const { punishment } = models;

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
  const time = interaction.options.getString("date");
  const reason = interaction.options.getString("reason");

  const modId = interaction.user.id;
  const mod = await interaction.guild?.members.fetch(modId);

  if (!mod?.permissions.has([PermissionsBitField.Flags.BanMembers])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const userToBan = await interaction.guild?.members.fetch(user?.id || "");

  if (!userToBan || !mod || !reason) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong data`,
    });
  }

  try {
    await userToBan.ban();

    await interaction.client.users.send(userToBan, {
      embeds: [
        embed({
          title: `You have been banned on ${interaction.guild?.name}`,
          description: `Reason: **${reason}**\nby ${mod.user.tag}\nIf you wanna clarify information, contact to him`,
        }),
      ],
    });
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: "I cannot ban that user",
    });
  }
  const punish = await new punishment({
    expires: time ? new Date().getTime() + timeConvert(time) * 1000 : -1,
    uid: userToBan.user.id,
    modId,
    reason,
    gid: interaction.guild?.id,
    type: "ban",
  }).save();

  const footer: APIEmbedFooter = {
    text: `by ${mod.displayName}`,
  };

  return interaction
    .reply({
      embeds: [
        embed({
          title: "Ban",
          description: `${userToBan} has been **banned**.\nReason: **${reason}**\nTime: ${time}`,
          footer,
        }),
      ],
    })
    .then(() => {
      if (time) {
        setTimeout(async () => {
          await punishment.findOneAndDelete({ _id: punish._id });
          const linkToServer = await interaction.guild?.invites.create(
            interaction.channel as TextChannel,
            {
              maxAge: 0,
              maxUses: 0,
            }
          );
          await interaction.guild?.members.unban(userToBan);
          await interaction.client.users.send(userToBan, {
            embeds: [
              embed({
                title: `You have been unbanned on ${interaction.guild?.name}`,
                description: `__Your welcome ${
                  userToBan.displayName
                }__\n${linkToServer?.toString()}\nunbanned by **${
                  mod.user.tag
                }**`,
                color: Colors.success,
              }),
            ],
          });
        }, timeConvert(time) * 1000);
      }
    });
});
