import {
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { command, CustomId, embed } from "../../utils";
import models from "../../models";
const { modChannel } = models;

const meta = new SlashCommandBuilder()
  .setName("report")
  .setDescription("Report user if he breaks the rules")
  .addUserOption((option) =>
    option.setName("user").setDescription("Enter username").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("reason").setDescription("Enter reason").setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const user = interaction.options.getUser("user");
  const reason = interaction.options.getString("reason");

  const gid = interaction.guild?.id;

  const data = await modChannel.findOne({ gid });

  const logChannel = interaction.guild?.channels.cache.get(data?.channelId!) as
    | TextChannel
    | undefined;

  if (!data || !logChannel) {
    return interaction.reply({
      ephemeral: true,
      content: "Server don't set up a moderator channel",
    });
  }

  const embedMessage = embed({
    title: `Report`,
    description: `${user} was reported\nReason: ${reason}`,
    footer: { text: `by ${interaction.user.tag} id ${interaction.user.id}` },
  });

  const btn = new ButtonBuilder()
    .setCustomId(CustomId.reportClose)
    .setLabel("Close report")
    .setStyle(4);

  const component = new ActionRowBuilder<ButtonBuilder>().addComponents(btn);

  await logChannel.send({
    embeds: [embedMessage],
    components: [component],
  });

  return interaction.reply({
    ephemeral: true,
    content: `Message was sended to moderation channel`,
    embeds: [embedMessage],
  });
});
