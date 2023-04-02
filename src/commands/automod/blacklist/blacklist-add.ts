import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { Colors, command, embed } from "../../../utils";
import models from "../../../models";

const { automod } = models;

const meta = new SlashCommandBuilder()
  .setName("blacklist-add")
  .setDescription("Adds a word to your blacklist")
  .addStringOption((option) =>
    option
      .setName("word")
      .setDescription("Type your word")
      .setMinLength(1)
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const word = interaction.options.getString("word")?.toLowerCase() as string;
  const user = interaction.guild?.members.cache.get(interaction.user.id);

  if (!user?.permissions.has([PermissionsBitField.Flags.MuteMembers])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const gid = interaction.guild?.id;

  const isExist = await automod.findOne({ gid });
  if (isExist) {
    if (isExist.words.includes(word)) {
      return interaction.reply({
        ephemeral: true,
        content: "Word already in list",
      });
    }
    isExist.words.push(word);
    await isExist.save();
  } else {
    await new automod({
      gid,
      words: [word],
      whilelist: [],
    }).save();
  }

  return interaction.reply({
    ephemeral: true,
    embeds: [
      embed({
        color: Colors.success,
        title: "Word has been added",
        description: `**${word}** has been added to our database`,
      }),
    ],
  });
});
