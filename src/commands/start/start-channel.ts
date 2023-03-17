import {
  ChannelType,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { command, embed } from "../../utils";
import models from "../../models";

const { welcomeRole } = models;

const meta = new SlashCommandBuilder()
  .setName("start-channel")
  .setDescription("Sets a channel for welcomes")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription(
        "Channel to welcome users, leave empty if you wanna DM users"
      )
      .setRequired(false)
  );

export default command(meta, async ({ interaction }) => {
  const channel = interaction.options.getChannel("channel");
  const gid = interaction.guild?.id;

  const user = interaction.guild?.members.cache.get(interaction.user.id);

  if (!user?.permissions.has([PermissionsBitField.Flags.ManageGuild])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }
  if (channel && channel.type !== ChannelType.GuildText) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong channel type`,
    });
  }

  const id = channel ? channel.id : "DM";

  const model = await welcomeRole.findOne({ gid });
  if (model) {
    model.channelId = id;
    await model.save();
  } else {
    await new welcomeRole({
      gid,
      roleId: [],
      channelId: id,
      messageState: false,
    }).save();
  }

  return interaction.reply({
    ephemeral: true,
    embeds: [
      embed({
        title: "Welcome channel",
        description: `Users will receive a welcome message in ${
          channel ? channel : id
        }`,
      }),
    ],
  });
});
