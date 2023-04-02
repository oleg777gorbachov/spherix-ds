import { PermissionsBitField, Role, SlashCommandBuilder } from "discord.js";
import { command, timeConvert } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("temprole")
  .setDescription("Adds temporary role to user")
  .addUserOption((option) =>
    option.setName("user").setDescription("Provide a user").setRequired(true)
  )
  .addRoleOption((option) =>
    option.setName("role").setDescription("Provide temprole").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("date")
      .setDescription("Date (1 min, 1d, 3m, etc...)")
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const id = interaction.options.getUser("user")!.id;
  const role = interaction.options.getRole("role") as Role;
  let date: number | string = interaction.options.getString("date") as string;

  const userExec = interaction.guild?.members.cache.get(interaction.user.id);

  if (!userExec?.permissions.has([PermissionsBitField.Flags.ManageRoles])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const numTime = timeConvert(date);
  if (numTime === undefined) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong parametrs`,
    });
  }
  date = numTime;

  const user = interaction.guild?.members.cache.get(id);

  if (user?.roles.cache.has(role?.id!)) {
    return interaction.reply({
      ephemeral: true,
      content: `User already have this role`,
    });
  }

  try {
    await user?.roles.add(role);
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: `Maybe role has too much permission and I can't assign it to user!`,
    });
  }

  setTimeout(() => user?.roles.remove(role), date * 1000);

  return interaction.reply({
    ephemeral: true,
    content: `${role} has been added to user ${user}, for ${date}`,
  });
});
