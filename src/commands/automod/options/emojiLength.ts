import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { Colors, command, embed, stringSplit } from "../../../utils";
import models from "../../../models";
const { automod } = models;

const meta = new SlashCommandBuilder()
  .setName("automod-emoji-length")
  .setDescription("Setups maximum length of emoji in message")
  .addNumberOption((option) =>
    option
      .setName("length")
      .setDescription("Max emoji length (minimum 3, max 30)")
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  let length = interaction.options.getNumber("length") as number;

  if (length < 3) {
    length = 3;
  }
  if (length > 30) {
    length = 30;
  }

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
    model.maxEmoji = length;
    await model.save();
  } else {
    await new automod({ gid, maxEmoji: length }).save();
  }

  return interaction.reply({
    embeds: [
      embed({
        title: `⚔️ Automod`,
        description: stringSplit([
          `Automoderation emoji state - ${model?.emoji}`,
          `Maximum emoji in message - ${model?.maxEmoji}`,
        ]),
        color: Colors.white,
      }),
    ],
  });
});
