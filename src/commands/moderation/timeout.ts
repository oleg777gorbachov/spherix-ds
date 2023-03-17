import {
  APIEmbedFooter,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import models from "../../models";
import { command, embed } from "../../utils";
const { punishment } = models;

const meta = new SlashCommandBuilder()
  .setName("timeout")
  .setDescription("Hard mutes a user (timeout)")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("Provide a username")
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option
      .setName("timeout")
      .setDescription("Time to timeout user")
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
  const time = interaction.options.getNumber("timeout");
  const reason = interaction.options.getString("reason");

  const modId = interaction.user.id;
  const mod = await interaction.guild?.members.fetch(modId);

  if (!mod?.permissions.has([PermissionsBitField.Flags.MuteMembers])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const gid = interaction.guild?.id;
  const uid = user?.id;
  const expires = new Date().getTime() + time! * 1000;

  const userToMute = await interaction.guild?.members.fetch(user?.id || "");

  if (!gid || !uid || !userToMute || !mod || !time || !reason) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong data`,
    });
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

  try {
    await userToMute.timeout(time * 1000, reason);
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: "I cannot timeout that user",
    });
  }

  const footer: APIEmbedFooter = {
    text: `by ${mod.displayName}`,
  };

  return interaction
    .reply({
      embeds: [
        embed({
          title: "Timeout",
          description: `${userToMute} has been timeoted for **${time}** seconds.\nReason: **${reason}**`,
          footer,
        }),
      ],
      fetchReply: true,
    })
    .then((message) =>
      setTimeout(async () => {
        const id = punish!._id;
        await punishment.findOneAndDelete({ _id: id });
      }, time! * 1000)
    );
});
