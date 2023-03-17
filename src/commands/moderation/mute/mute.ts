import {
  APIEmbedFooter,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { Colors, command, embed } from "../../../utils";
import models from "../../../models";

const { punishment } = models;

const meta = new SlashCommandBuilder()
  .setName("mute")
  .setDescription("Mute a user")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("Provide a username")
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option
      .setName("timeout")
      .setDescription("Time to mute user")
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

  let muteRole = interaction.guild?.roles.cache.find((role) =>
    role.name.toLowerCase().includes("muted" || "mute")
  );
  const userToMute = await interaction.guild?.members.fetch(user?.id || "");

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

  try {
    await userToMute.timeout(null, reason);
    userToMute.roles.add(muteRole);
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: "I cannot mute that user",
    });
  }

  const footer: APIEmbedFooter = {
    text: `by ${mod.displayName}`,
  };

  const footerUnMuted: APIEmbedFooter = {
    text: `by ${mod.displayName}\nAlready unmuted.`,
  };

  return interaction
    .reply({
      embeds: [
        embed({
          title: "Mute",
          description: `${userToMute} has been muted for **${time}** seconds.\nReason: **${reason}**`,
          footer,
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
                title: "Mute",
                color: Colors.success,
                description: `${userToMute} has been muted for ${time} seconds.\nReason: **${reason}**`,
                footer: footerUnMuted,
              }),
            ],
          });
        }
      }, time! * 1000)
    );
});
