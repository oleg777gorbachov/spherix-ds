import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { Colors, command, embed } from "../../../utils";
import models from "../../../models";

const { blacklist } = models;

const meta = new SlashCommandBuilder()
  .setName("blacklist-remove")
  .setDescription("Removes a word from your blacklist")
  .addStringOption((option) =>
    option
      .setName("word")
      .setDescription("Enter your word")
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

  const isExist = await blacklist.findOne({ gid });

  if (!isExist) {
    return interaction.reply({
      ephemeral: true,
      content: "You don't have blacklisted words",
    });
  }

  if (!isExist.words.includes(word)) {
    return interaction.reply({
      ephemeral: true,
      content: "Your blacklist don't have this word",
    });
  }
  isExist.words = isExist.words.filter((e) => e !== word);
  await isExist.save();

  return interaction.reply({
    ephemeral: true,
    embeds: [
      embed({
        color: Colors.success,
        title: "Word has been removed",
        description: `__${word}__ has been removed from our database`,
      }),
    ],
  });
});
