import { embed } from "./../../utils/embed";
import {
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Colors, command, CustomId } from "../../utils";
import models from "../../models";
import { TextChannel } from "discord.js";
const { modChannel } = models;

const meta = new SlashCommandBuilder()
  .setName("ticket")
  .setDescription("Send ticket which reports a bug on the server")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("Describe you're a bug that's you found.")
      .setMinLength(1)
      .setMaxLength(2000)
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const message = interaction.options.getString("message");

  const gid = interaction.guild?.id;

  const data = await modChannel.findOne({ gid });
  if (!data) {
    return interaction.reply({
      ephemeral: true,
      content: "Server don't set up a moderator channel",
    });
  }

  const logChannel = (await interaction.guild?.channels.fetch(
    data.channelId
  )) as TextChannel;

  const btn = new ButtonBuilder()
    .setCustomId(CustomId.ticketClose)
    .setLabel("Close ticket")
    .setStyle(4);

  const component = new ActionRowBuilder<ButtonBuilder>().addComponents(btn);

  await logChannel.send({
    embeds: [
      embed({
        title: `Ticket by ${interaction.user.tag}`,
        description: message!,
      }),
    ],
    components: [component],
  });

  return interaction.reply({
    ephemeral: true,
    embeds: [
      embed({
        title: "Ticket sended",
        description: "",
        color: Colors.success,
      }),
    ],
  });
});
