import {
  SlashCommandBuilder,
  ChannelType,
  PermissionsBitField,
  TextChannel,
} from "discord.js";
import { command } from "../../utils";
import models from "../../models";

const { stats } = models;

const meta = new SlashCommandBuilder()
  .setName("channel-stats")
  .setDescription("Add statistic channel")
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
    const allMembers = await interaction.guild?.members.fetch();
    const members = allMembers?.filter((e) => !e.user.bot).size;
    const bots = allMembers?.filter((e) => e.user.bot).size;

    await interaction.deferReply();
    await interaction.deleteReply();

    const memberChannel = await interaction.guild?.channels.create({
      name: `👪 Members: ${members}`,
      type: ChannelType.GuildVoice,
    });
    const allMembersChannel = await interaction.guild?.channels.create({
      name: `🟩 All Members: ${allMembers?.size}`,
      type: ChannelType.GuildVoice,
    });
    const botChannel = await interaction.guild?.channels.create({
      name: `🤖 Bots: ${bots}`,
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

    allMembersChannel?.setParent(category!);
    memberChannel?.setParent(category!);
    botChannel?.setParent(category!);

    if (!isExist) {
      await new stats({
        state: require,
        categoryId: category?.id,
        membersId: memberChannel?.id,
        allMembersId: allMembersChannel?.id,
        botId: botChannel?.id,
        gid,
      }).save();
    } else {
      isExist.state = require!;
      await interaction.guild?.channels.cache.get(isExist.membersId)?.delete();
      await interaction.guild?.channels.cache.get(isExist.categoryId)?.delete();
      await interaction.guild?.channels.cache.get(isExist.botId)?.delete();
      await interaction.guild?.channels.cache
        .get(isExist.allMembersId)
        ?.delete();
      isExist.membersId = memberChannel?.id!;
      isExist.categoryId = category?.id!;
      isExist.allMembersId = allMembersChannel?.id!;
      isExist.botId = botChannel?.id!;
      await isExist.save();
    }

    return (interaction.channel as TextChannel).send({
      content: `${botChannel} created\n${allMembersChannel} created\n${memberChannel} created\nState **active**`,
    });
  } else {
    if (isExist) {
      await interaction.guild?.channels.cache.get(isExist.membersId)?.delete();
      await interaction.guild?.channels.cache.get(isExist.categoryId)?.delete();
      await interaction.guild?.channels.cache.get(isExist.botId)?.delete();
      await interaction.guild?.channels.cache
        .get(isExist.allMembersId)
        ?.delete();
      isExist.state = require!;
      await isExist.save();
    }

    return interaction.reply({
      ephemeral: true,
      content: `Channels deleted\nState **unactive**`,
    });
  }
});
