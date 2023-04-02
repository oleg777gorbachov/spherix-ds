import { SlashCommandBuilder } from "discord.js";
import { Colors, command, embed, stringSplit } from "../../../utils";
import models from "../../../models";
const { warns } = models;

const meta = new SlashCommandBuilder()
  .setName("warnings")
  .setDescription("Shows warnings")
  .addUserOption((option) =>
    option.setName("user").setDescription("Enter a username").setRequired(false)
  );

export default command(meta, async ({ interaction }) => {
  const user = interaction.options.getUser("user");
  const gid = interaction.guild?.id;

  let model;
  if (user) {
    model = await warns.find({ gid, uid: user.id });
  } else {
    model = await warns.find({ gid });
  }
  console.log(user?.id, model);

  const title = "⚠️ Warns";

  if (!model || model.length === 0) {
    return interaction.reply({
      embeds: [
        embed({
          title,
          description: "You don't have any warnings",
          color: Colors.warn,
        }),
      ],
    });
  }

  let desc: string[] = [];

  for (let warn of model) {
    const mod = interaction.guild?.members.cache.get(warn.modId);
    const user = interaction.guild?.members.cache.get(warn.uid);
    desc.push(
      `-----------------\nID **${warn.id}** by ${mod}\nwarned user ${user}\nReason \`${warn.reason}\``
    );
  }

  return interaction.reply({
    embeds: [
      embed({
        title,
        description: stringSplit(desc),
        color: Colors.warn,
      }),
    ],
  });
});
