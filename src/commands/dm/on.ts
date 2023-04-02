import { Guild, SlashCommandBuilder } from "discord.js";
import { Colors, command, embed } from "../../utils";
import models from "../../models";
const { ignore } = models;

const meta = new SlashCommandBuilder()
  .setName("on")
  .setDescription("Mute notification from guild")
  .addStringOption((option) =>
    option.setName("gid").setDescription("Enter a guild id").setRequired(false)
  );

export default command(meta, async ({ interaction }) => {
  const gid =
    interaction.options.getString("gid") || (interaction.guild?.id as string);
  const uid = interaction.user.id;

  const model = await ignore.findOne({ uid });

  const guild: Guild | undefined = interaction.client.guilds.cache.get(gid);

  if (!guild) {
    return interaction.reply({
      ephemeral: true,
      embeds: [
        embed({
          title: "🔔 Notification",
          description: `You provide wrong gid`,
        }),
      ],
    });
  }

  if (!model || !model.gids.includes(gid)) {
    return interaction.reply({
      ephemeral: true,
      embeds: [
        embed({
          title: "🔔 Notification",
          description: `You don't have this guild in muted`,
          footer: {
            text: `${guild.name}`,
            icon_url: `${guild.iconURL()}`,
          },
        }),
      ],
    });
  }

  model.gids = model.gids.filter((e) => e !== gid);
  await model.save();

  return interaction.reply({
    ephemeral: true,
    embeds: [
      embed({
        title: "🔔 Notification",
        description: `You're allowed notification from guild`,
        footer: {
          text: `${guild.name}`,
          icon_url: `${guild.iconURL()}`,
        },
        color: Colors.success,
      }),
    ],
  });
});
