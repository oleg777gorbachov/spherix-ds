import { SlashCommandBuilder } from "discord.js";
import { Colors, command, embed, stringSplit } from "../../utils";
import models from "../../models";
const { ignore } = models;

const meta = new SlashCommandBuilder()
  .setName("list")
  .setDescription("Show list of your notification");

export default command(meta, async ({ interaction }) => {
  const uid = interaction.user.id;
  const model = await ignore.findOne({ uid });

  if (model?.isAll) {
    return interaction.reply({
      ephemeral: true,
      embeds: [
        embed({
          title: "🔔 Notification",
          description: `You blocked all notification`,
          color: Colors.success,
        }),
      ],
    });
  }

  if (!model || model.gids.length === 0) {
    return interaction.reply({
      ephemeral: true,
      embeds: [
        embed({
          title: "🔔 Notification",
          description: `You don't have any blocked notification`,
          color: Colors.success,
        }),
      ],
    });
  }

  let desc: string[] = [];
  let isSave = false;

  for (let gid of model.gids) {
    const guild = interaction.client.guilds.cache.get(gid);
    if (!guild) {
      model.gids = model.gids.filter((e) => e !== gid);
      isSave = true;
    }
    desc.push(`gid: ${guild?.id} **${guild?.name}**`);
  }

  if (isSave) {
    await model.save();
  }

  return interaction.reply({
    ephemeral: true,
    embeds: [
      embed({
        title: "🔔 Notification",
        description: stringSplit(desc),
        color: Colors.success,
      }),
    ],
  });
});
