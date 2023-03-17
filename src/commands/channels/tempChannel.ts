import {
  ChannelType,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { command } from "../../utils";
import models from "../../models";

const { tempChannel } = models;

const meta = new SlashCommandBuilder()
  .setName("channel-temp")
  .setDescription("Creates a channel that creates a temporary voice channel.")
  .addStringOption((option) =>
    option.setName("name").setDescription("Your channel name").setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const userExec = interaction.guild?.members.cache.get(interaction.user.id);
  if (!userExec?.permissions.has([PermissionsBitField.Flags.ManageChannels])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }
  const name = interaction.options.getString("name") || "Temp-voice create";

  const channel = await interaction.guild?.channels.create({
    name,
    type: ChannelType.GuildVoice,
    permissionOverwrites: [],
  });

  const gid = interaction.guild?.id;
  let isExist = await tempChannel.findOne({ gid });
  if (isExist) {
    const dlt = interaction.guild?.channels.cache.get(isExist.channelId);
    if (dlt) {
      await interaction.guild?.channels.delete(dlt);
    }
    isExist.channelId = channel?.id!;
    await isExist.save();
  } else {
    await new tempChannel({
      channelId: channel?.id,
      gid,
    }).save();
  }

  return interaction.reply({
    ephemeral: true,
    content: `${channel} was created`,
  });
});
