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
  .setName("blacklist-remove-role")
  .setDescription("Removes a role that the bot will ignore")
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
  if (!isExist) {
    return;
  }

  if (!isExist.whitelist.includes(role?.id)) {
    return interaction.reply({
      ephemeral: true,
      content: "You don't have this role in your list",
    });
  }
  isExist.whitelist = isExist.whitelist.filter((e) => e !== role.id);
  await isExist.save();

  return interaction.reply({
    ephemeral: true,
    embeds: [
      embed({
        color: Colors.success,
        title: "Role has been removed",
        description: `${role} has been removed from our database`,
      }),
    ],
  });
});
