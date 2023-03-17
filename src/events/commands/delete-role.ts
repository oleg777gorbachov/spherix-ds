import { CustomId, embed, event } from "../../utils";
import models from "../../models";
import { PermissionsBitField } from "discord.js";
const { welcomeRole } = models;

const interactionCreate = event(
  "interactionCreate",
  async ({ log }, interaction) => {
    const gid = interaction.guild?.id;

    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === CustomId.roleRmove) {
        const userExec = await interaction.guild?.members.fetch(
          interaction.user.id
        );
        if (
          !userExec?.permissions.has([PermissionsBitField.Flags.ManageChannels])
        ) {
          return interaction.reply({
            ephemeral: true,
            content: `Insufficient permission`,
          });
        }

        const roleId: string = interaction.values[0];
        const model = await welcomeRole.findOne({ gid });
        if (!model) {
          return interaction.reply({
            ephemeral: true,
            content: "You don't have start role",
          });
        }
        model.roleId = model?.roleId?.filter((e) => e !== roleId);
        await model.save();
        const role = interaction.guild?.roles.cache.get(roleId);
        return interaction.message.edit({
          embeds: [
            embed({
              title: "Role deleted",
              description: `${role} has been deleted`,
            }),
          ],
          components: [],
        });
      }
    }
  }
);

export default interactionCreate;
