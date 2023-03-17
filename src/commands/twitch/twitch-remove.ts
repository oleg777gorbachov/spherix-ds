import {
  ActionRowBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { Colors, command, CustomId, embed } from "../../utils";
import models from "../../models";
const { notification } = models;

const meta = new SlashCommandBuilder()
  .setName("twitch-remove")
  .setDescription("Removes a streamer from your notification list")
  .addStringOption((option) =>
    option.setName("username").setDescription("Specify your streamer to remove")
  );

export default command(meta, async ({ interaction }) => {
  const userExec = interaction.guild?.members.cache.get(interaction.user.id);

  if (!userExec?.permissions.has([PermissionsBitField.Flags.ManageChannels])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const username = interaction.options.getString("username") as string;
  const gid = interaction.guild?.id;

  const isExist = await notification.findOne({ gid });

  if (!isExist || isExist.twitch.length === 0) {
    return interaction.reply({
      ephemeral: true,
      content: `You don't have any notification`,
    });
  }

  if (isExist.twitch.includes(username)) {
    isExist.twitch = isExist.twitch.filter((e) => e !== username);
    await isExist.save();
    return interaction.reply({
      embeds: [
        embed({
          title: "Streamer deleted",
          color: Colors.success,
          description: `${username} has been deleted from database`,
        }),
      ],
    });
  }

  const menu: ActionRowBuilder<any> = new ActionRowBuilder().setComponents(
    new StringSelectMenuBuilder().setCustomId(CustomId.twitchRemove).setOptions(
      isExist.twitch.map((e) => {
        return { label: e, value: e };
      })
    )
  );

  return interaction.reply({
    components: [menu.toJSON()],
    fetchReply: true,
  });
});
