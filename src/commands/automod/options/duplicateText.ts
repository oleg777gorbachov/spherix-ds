import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { Colors, command, embed } from "../../../utils";
import models from "../../../models";
const { automod } = models;

const meta = new SlashCommandBuilder()
  .setName("automod-duplicate")
  .setDescription("Setups duplicate text settings")
  .addBooleanOption((option) =>
    option
      .setName("state")
      .setDescription("Automod duplicate text state")
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const state = interaction.options.getBoolean("state") as boolean;

  const gid = interaction.guildId;

  const mod = interaction.guild?.members.cache.get(interaction.user.id);

  if (!mod?.permissions.has([PermissionsBitField.Flags.ModerateMembers])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }
  const model = await automod.findOne({ gid });
  if (model) {
    model.duplicateText = state;
    await model.save();
  } else {
    await new automod({ gid, duplicateText: state }).save();
  }

  return interaction.reply({
    embeds: [
      embed({
        title: `⚔️ Automod`,
        description: `Automoderation duplicate text state - ${state}`,
        color: Colors.white,
      }),
    ],
  });
});
