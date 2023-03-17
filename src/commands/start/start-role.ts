import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";
import models from "../../models";

const { welcomeRole } = models;

const meta = new SlashCommandBuilder()
  .setName("start-role")
  .setDescription("Gives a role when user join to server")
  .addRoleOption((option) =>
    option.setName("role").setDescription("Provide role").setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const role = interaction.options.getRole("role");
  const gid = interaction.guild?.id;

  const user = interaction.guild?.members.cache.get(interaction.user.id);

  if (!user?.permissions.has([PermissionsBitField.Flags.ManageGuild])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  if (!role) {
    return interaction.reply({
      ephemeral: true,
      content: "Wrong role",
    });
  }

  const isExist = await welcomeRole.findOne({ gid });
  if (isExist && isExist.roleId) {
    if (isExist.roleId.includes(role.id)) {
      return interaction.reply({
        ephemeral: true,
        content: `Role already in list`,
      });
    }
    isExist.roleId.push(role.id);
    await isExist.save();
  } else {
    await new welcomeRole({
      gid,
      roleId: role.id,
      messageState: false,
    }).save();
  }

  return interaction.reply({
    ephemeral: true,
    content: `Role ${role} has been added to start role`,
  });
});
