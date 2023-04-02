import {
  ChannelType,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { Colors, command, embed } from "../../../utils";
import models from "../../../models";
const { warns, modChannel } = models;

const meta = new SlashCommandBuilder()
  .setName("unwarn")
  .setDescription("Unwarns user")
  .addNumberOption((option) =>
    option.setName("id").setDescription("Enter warning id").setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const id = interaction.options.getNumber("id") as number;

  const modId = interaction.user.id;
  const mod = interaction.guild?.members.cache.get(modId);

  if (!mod?.permissions.has([PermissionsBitField.Flags.KickMembers])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const gid = interaction.guild?.id;

  const model = await warns.findOne({ gid, id });

  if (!model) {
    return interaction.reply({
      ephemeral: true,
      embeds: [
        embed({
          title: "Error",
          description: `I cannot find warning with such id`,
        }),
      ],
    });
  }

  const modModel = await modChannel.findOne({ gid });

  const userToUnwarn = interaction.guild?.members.cache.get(model.uid);
  const title = "⚠️ Unwarned";
  const description = `${userToUnwarn} has been unwarned\nWarn id: **${model.id}**`;

  if (modModel) {
    const channel = interaction.guild?.channels.cache.get(modModel.channelId);
    if (channel && channel.type === ChannelType.GuildText) {
      await channel.send({
        embeds: [
          embed({
            title,
            description,
            color: Colors.white,
            thumbnail: {
              url: mod.displayAvatarURL(),
            },
            footer: {
              text: `id: ${mod.id} | by ${mod.user.tag}`,
            },
          }),
        ],
      });
    }
  }

  await model.deleteOne();

  return interaction.reply({
    embeds: [
      embed({
        title,
        description,
        color: Colors.success,
      }),
    ],
  });
});
