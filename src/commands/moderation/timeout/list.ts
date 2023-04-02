import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import models from "../../../models";
import { command, embed, numToTime, stringSplit } from "../../../utils";
const { punishment } = models;

const meta = new SlashCommandBuilder()
  .setName("timeout-list")
  .setDescription("Shows list of timeouts");

export default command(meta, async ({ interaction }) => {
  const modId = interaction.user.id;
  const mod = interaction.guild?.members.cache.get(modId);

  if (!mod?.permissions.has([PermissionsBitField.Flags.MuteMembers])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const gid = interaction.guild?.id;

  const punish = await punishment.find({ gid, type: "timeout" });

  if (!punish || punish.length === 0) {
    return interaction.reply({
      ephemeral: true,
      embeds: [
        embed({
          title: "Timeouts",
          description: "You don't have any timeouts",
        }),
      ],
    });
  }

  let desc: string[] = [];

  for (let key of punish) {
    const mod = interaction.guild?.members.cache.get(key.modId);
    const user = interaction.guild?.members.cache.get(key.uid);

    desc.push(
      `-----------------\nby ${mod}\ntimeouted user ${user}\nReason \`${
        key.reason
      }\`\nExpires in ${numToTime(key.expires - new Date().getTime())}`
    );
  }

  return interaction.reply({
    embeds: [
      embed({
        title: "Timeouts",
        description: stringSplit(desc),
      }),
    ],
  });
});
