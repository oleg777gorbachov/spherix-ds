import {
  APIRole,
  PermissionsBitField,
  Role,
  SlashCommandBuilder,
} from "discord.js";
import { Colors, command, embed } from "../../../utils";
import models from "../../../models";

const { automod } = models;

const meta = new SlashCommandBuilder()
  .setName("blacklist-add-role")
  .setDescription("Adds a role that the bot will ignore")
  .addRoleOption((option) =>
    option
      .setName("role")
      .setDescription(
        "Add a role for which the words from the blacklist do not apply"
      )
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const role = interaction.options.getRole("role") as Role | APIRole;
  const user = interaction.guild?.members.cache.get(interaction.user.id);

  if (!user?.permissions.has([PermissionsBitField.Flags.ManageGuild])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const gid = interaction.guild?.id;

  const isExist = await automod.findOne({ gid });
  if (isExist) {
    if (isExist.whitelist.includes(role?.id)) {
      return interaction.reply({
        ephemeral: true,
        content: "Role already in list",
      });
    }
    isExist.whitelist.push(role?.id);
    await isExist.save();
  } else {
    await new automod({
      gid,
      words: [],
      whilelist: [role?.id],
    }).save();
  }

  return interaction.reply({
    ephemeral: true,
    embeds: [
      embed({
        color: Colors.success,
        title: "Role has been added",
        description: `${role} has been added to our database`,
      }),
    ],
  });
});
