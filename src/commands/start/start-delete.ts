import {
  ActionRowBuilder,
  PermissionsBitField,
  Role,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { command, CustomId } from "../../utils";
import models from "../../models";

const { welcomeRole } = models;

const meta = new SlashCommandBuilder()
  .setName("start-delete")
  .setDescription("Deletes start roles");

export default command(meta, async ({ interaction }) => {
  const gid = interaction.guild?.id;

  const user = interaction.guild?.members.cache.get(interaction.user.id);

  if (!user?.permissions.has([PermissionsBitField.Flags.ManageGuild])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const model = await welcomeRole.findOne({ gid });
  if (!model) {
    return interaction.reply({
      ephemeral: true,
      content: `You don't have any start roles`,
    });
  }

  if (!model.roleId) {
    return interaction.reply({
      ephemeral: true,
      content: `You don't have any start roles`,
    });
  }

  const roles: Role[] = [];
  for (let role of model.roleId) {
    const r = interaction.guild?.roles.cache.get(role);
    if (r) roles.push(r);
  }

  const menu: ActionRowBuilder<any> = new ActionRowBuilder().setComponents(
    new StringSelectMenuBuilder().setCustomId(CustomId.roleRmove).setOptions(
      roles.map((e) => {
        return { label: e.name, value: e.id };
      })
    )
  );

  return interaction.reply({
    components: [menu],
  });
});
