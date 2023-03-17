import {
  ChannelType,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { Colors, command, embed } from "../../utils";
import models from "../../models";

const { modChannel } = models;

const meta = new SlashCommandBuilder()
  .setName("channel-mod")
  .setDescription("Sets a channel for moderation (logs, reports, etc...)")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("Tag channel (default where command type in)")
      .setRequired(false)
  );

export default command(meta, async ({ interaction }) => {
  const channel =
    interaction.options.getChannel("channel") || interaction.channel;

  const user = interaction.guild?.members.cache.get(interaction.user.id);

  if (!user?.permissions.has([PermissionsBitField.Flags.ManageChannels])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  if (channel?.type !== ChannelType.GuildText) {
    return interaction.reply({
      ephemeral: true,
      content: `Channel type should be text`,
    });
  }
  const gid = interaction.guild?.id;
  const message = await (channel as TextChannel).send({
    embeds: [
      embed({
        color: Colors.success,
        description: "This channel set as a moderation channel",
        title: "Mod channel",
      }),
    ],
  });

  const isExist = await modChannel.findOne({ gid });
  if (isExist) {
    const channnel = interaction.guild?.channels.cache.get(isExist.channelId);
    await (channel as TextChannel).messages.cache
      .get(isExist.messageId)
      ?.delete();
    isExist.channelId = channel?.id!;
    isExist.messageId = message.id;
    await isExist.save();
  } else {
    await new modChannel({
      gid,
      channelId: channel?.id!,
      messageId: message.id,
    }).save();
  }

  return interaction.reply({
    ephemeral: true,
    content: `${channel} - set as mod channel`,
  });
});
