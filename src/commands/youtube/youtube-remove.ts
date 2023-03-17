import {
  ActionRowBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { channelName, Colors, command, CustomId, embed } from "../../utils";
import models from "../../models";
const { notification } = models;

const meta = new SlashCommandBuilder()
  .setName("youtube-remove")
  .setDescription("Removes YouTube channel from your notification list")
  .addStringOption((option) =>
    option
      .setName("youtube_id")
      .setDescription("Provide channel id (NOT USER ID)")
      .setMinLength(1)
      .setRequired(false)
  );

export default command(meta, async ({ interaction }) => {
  const id = interaction.options.getString("youtube_id");

  const userExec = interaction.guild?.members.cache.get(interaction.user.id);

  if (!userExec?.permissions.has([PermissionsBitField.Flags.ManageChannels])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const gid = interaction.guild?.id;

  const isExist = await notification.findOne({ gid });

  if (!isExist || isExist.youtube.length === 0) {
    return interaction.reply({
      ephemeral: true,
      content: `You don't have any notification`,
    });
  }

  if (id && isExist.youtube.includes(id)) {
    isExist.youtube = isExist.youtube.filter((e) => e !== id);
    await isExist.save();
    return interaction.reply({
      embeds: [
        embed({
          title: "Channel deleted",
          color: Colors.success,
          description: `${id} has been deleted from database`,
        }),
      ],
    });
  }

  const labels: { label: string; value: string }[] = [];
  isExist.youtube.map(async (e) => {
    const state = await channelName(e);
    labels.push({ label: state?.state ? state.name! : e, value: e });
  });

  const menu: ActionRowBuilder<any> = new ActionRowBuilder().setComponents(
    new StringSelectMenuBuilder()
      .setCustomId(CustomId.youtubeRemove)
      .setOptions(labels)
  );

  return interaction.reply({
    components: [menu.toJSON()],
    fetchReply: true,
  });
});
