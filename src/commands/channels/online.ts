import {
  SlashCommandBuilder,
  ChannelType,
  PermissionsBitField,
} from "discord.js";
import { command } from "../../utils";
import models from "../../models";

const { stats } = models;

const meta = new SlashCommandBuilder()
  .setName("stats-online")
  .setDescription("Add statistic channel with users online")
  .addBooleanOption((option) =>
    option
      .setName("enable")
      .setDescription("Do you want to enable statistic or not?")
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const userExec = interaction.guild?.members.cache.get(interaction.user.id);
  if (!userExec?.permissions.has([PermissionsBitField.Flags.ManageChannels])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const require = interaction.options.getBoolean("enable");
  const gid = interaction.guild?.id;
  const isExist = await stats.findOne({ gid });

  if (require) {
    const online = await interaction.guild?.members.fetch();
    const members = online?.filter((e) => !e.user.bot).size;

    const memberChannel = await interaction.guild?.channels.create({
      name: `👪 Members: ${members}`,
      type: ChannelType.GuildVoice,
    });
    const onlineChannel = await interaction.guild?.channels.create({
      name: `🟩 Online: ${
        online?.filter(
          (e) => !e.user.bot && e.presence && e.presence?.status !== "offline"
        ).size
      }`,
      type: ChannelType.GuildVoice,
    });
    const category = await interaction.guild?.channels.create({
      name: "📈SERVER STATS📈",
      type: ChannelType.GuildCategory,
      position: 0,
      permissionOverwrites: [
        { id: interaction.guild.id, deny: [PermissionsBitField.Flags.Connect] },
      ],
    });

    onlineChannel?.setParent(category!);
    memberChannel?.setParent(category!);

    if (!isExist) {
      await new stats({
        state: require,
        categoryId: category?.id,
        membersId: memberChannel?.id,
        onlineId: onlineChannel?.id,
        gid,
      }).save();
    } else {
      isExist.state = require!;
      await interaction.guild?.channels.cache.get(isExist.membersId)?.delete();
      await interaction.guild?.channels.cache.get(isExist.categoryId)?.delete();
      await interaction.guild?.channels.cache.get(isExist.onlineId)?.delete();
      isExist.membersId = memberChannel?.id!;
      isExist.categoryId = category?.id!;
      isExist.onlineId = onlineChannel?.id!;
      await isExist.save();
    }
    return interaction.reply({
      ephemeral: true,
      content: `${onlineChannel} created\n${memberChannel} created\nState **active**`,
    });
  } else {
    if (isExist) {
      await interaction.guild?.channels.cache.get(isExist.onlineId)?.delete();
      await interaction.guild?.channels.cache.get(isExist.membersId)?.delete();
      await interaction.guild?.channels.cache.get(isExist.categoryId)?.delete();
      isExist.state = require!;
      await isExist.save();
    }
    return interaction.reply({
      ephemeral: true,
      content: `Channels deleted\nState **unactive**`,
    });
  }
});
