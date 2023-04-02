import {
  ChannelType,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { Colors, command, embed } from "../../../utils";
import models from "../../../models";

const { punishment, modChannel } = models;

const meta = new SlashCommandBuilder()
  .setName("unmute")
  .setDescription("Unmutes a user")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("Provide a username")
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const user = interaction.options.getUser("user");

  const modId = interaction.user.id;
  const mod = interaction.guild?.members.cache.get(modId);

  if (!mod?.permissions.has([PermissionsBitField.Flags.MuteMembers])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const gid = interaction.guild?.id;
  const uid = user?.id;

  const muteRole = interaction.guild?.roles.cache.find((role) =>
    role.name.toLowerCase().includes("muted" || "mute")
  );
  const userToMute = interaction.guild?.members.cache.get(user?.id || "");

  if (!gid || !uid || !userToMute || !mod || !muteRole) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong data`,
    });
  }

  try {
    userToMute.roles.remove(muteRole);
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: "I cannot unmute that user",
    });
  }

  const description = `${userToMute} has been unmuted`;
  const title = "😀 Unmute";
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

  await punishment.findOneAndDelete({ gid, uid, type: "mute" });

  return interaction.reply({
    embeds: [
      embed({
        title,
        description,
        color: Colors.success,
        footer: {
          text: `by ${mod.displayName}`,
        },
      }),
    ],
  });
});
