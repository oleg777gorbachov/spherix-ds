import { embed } from "../../utils/embed";
import { SlashCommandBuilder } from "discord.js";
import { Colors, command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("avatar")
  .setDescription("Get the avatar of user")
  .addUserOption((option) =>
    option.setName("user").setDescription("Enter a user").setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const user = interaction.options.getUser("user");

  const userFetch = await interaction.client.users.fetch(user!);

  return interaction.reply({
    embeds: [
      embed({
        title: `Avatar for ${user?.tag}`,
        image: {
          url: userFetch.displayAvatarURL({
            size: 1024,
          }),
        },
        color: Colors.random(),
      }),
    ],
  });
});
