import { SlashCommandBuilder } from "discord.js";
import { Colors, command, embed, stringSplit } from "../../utils";
import models from "../../models";
const { automod } = models;

const meta = new SlashCommandBuilder()
  .setName("automod-settings")
  .setDescription("Shows settings of automoderation");

export default command(meta, async ({ interaction }) => {
  const gid = interaction.guildId;
  const model = await automod.findOne({ gid });

  if (!model) {
    return interaction.reply({
      ephemeral: true,
      content: "You don't setup automod",
    });
  }

  const desc: string[] = [];

  for (let key of Object.entries((model as any)._doc)) {
    const exclude = ["state", "gid", "_id", "__v"];
    if (exclude.includes(key[0])) {
      continue;
    }
    desc.push(
      `${key[0].charAt(0).toUpperCase() + key[0].slice(1, key[0].length)} **${
        key[1]
      }**`
    );
  }

  return interaction.reply({
    embeds: [
      embed({
        title: `⚔️ Automod`,
        description: stringSplit(desc),
        color: Colors.white,
      }),
    ],
  });
});
