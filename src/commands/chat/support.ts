import { SlashCommandBuilder } from "discord.js";
import { Colors, command, embed, stringSplit } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("support")
  .setDescription(
    "If you wanna support bot creator, you can donate some money"
  );

export default command(meta, async ({ interaction }) => {
  return interaction.reply({
    ephemeral: true,
    embeds: [
      embed({
        title: "💵 Support",
        description: stringSplit([
          `Hi, if you want to support the bot's author`,
          "You can donate to him via this link",
          `https://donatello.to/spherix-dingis`,
        ]),
        color: Colors.success,
      }),
    ],
  });
});
