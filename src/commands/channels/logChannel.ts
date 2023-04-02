import {
  ChannelType,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { Colors, command, embed } from "../../utils";
import models from "../../models";

const { logs } = models;

const meta = new SlashCommandBuilder()
  .setName("channel-log")
  .setDescription("Sets a channel for logs")
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
        description: "This channel set as a logging channel",
        title: "Log channel",
      }),
    ],
  });

  const isExist = await logs.findOne({ gid });

  if (isExist) {
    isExist.channelId = channel?.id!;
    await isExist.save();
  } else {
    await new logs({
      gid: gid!,
      channelId: channel?.id!,
      state: true,
    }).save();
  }

  return interaction.reply({
    ephemeral: true,
    content: `${channel} - set as logging channel`,
  });
});
