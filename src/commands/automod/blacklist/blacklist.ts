import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { command, embed } from "../../../utils";
import models from "../../../models";

const { automod } = models;

const meta = new SlashCommandBuilder()
  .setName("blacklist-list")
  .setDescription("Shows a list of banned words");

export default command(meta, async ({ interaction }) => {
  const user = interaction.guild?.members.cache.get(interaction.user.id);

  if (!user?.permissions.has([PermissionsBitField.Flags.MuteMembers])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const gid = interaction.guild?.id;

  const model = await automod.findOne({ gid });

  if (!model) {
    return interaction.reply({
      ephemeral: true,
      content: "You don't have any blacklist words",
    });
  }

  let desc = ``;
  let counter = 1;

  for (let word of model.words) {
    desc += `\n${counter} ${word}`;
    counter++;
  }

  return interaction.reply({
    embeds: [
      embed({
        title: "Blacklist words",
        description: desc,
      }),
    ],
  });
});
