import { Colors } from "./../../utils/color/colors";
import { embed } from "./../../utils/embed";
import {
  ActionRowBuilder,
  ButtonBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { command, CustomId, stringSplit } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("react-role")
  .setDescription("React and you will receive a role")
  .addRoleOption((option) =>
    option.setName("role-1").setDescription("Role 1").setRequired(true)
  )
  .addRoleOption((option) =>
    option.setName("role-2").setDescription("Role 2").setRequired(false)
  )
  .addRoleOption((option) =>
    option.setName("role-3").setDescription("Role 3").setRequired(false)
  )
  .addRoleOption((option) =>
    option.setName("role-4").setDescription("Role 4").setRequired(false)
  )
  .addRoleOption((option) =>
    option.setName("role-5").setDescription("Role 5").setRequired(false)
  );

export default command(meta, async ({ interaction }) => {
  const role1 = interaction.options.getRole("role-1");
  const role2 = interaction.options.getRole("role-2");
  const role3 = interaction.options.getRole("role-3");
  const role4 = interaction.options.getRole("role-4");
  const role5 = interaction.options.getRole("role-5");

  const mod = interaction.guild?.members.cache.get(interaction.user.id);

  if (!mod?.permissions.has([PermissionsBitField.Flags.Administrator])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const channel = interaction.channel as TextChannel;

  await interaction.deferReply();
  await interaction.deleteReply();


  
  const buttons: ActionRowBuilder<any> = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("sd").setLabel(`${role1?.name}`).setStyle(1)
  );

  return channel.send({
    embeds: [
      embed({
        title: "Reaction roles",
        description: stringSplit([
          `React with the buttons bellow to get specified roles`,
          `${role1}, ${role2}, ${role3}, ${role4}, ${role5}`,
        ]),
        color: Colors.white,
      }),
    ],
    components: [buttons],
  });
});
