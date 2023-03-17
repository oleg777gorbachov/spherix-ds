import {
  APIEmbedFooter,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { Colors, command, embed } from "../../../utils";
import models from "../../../models";

const { punishment } = models;

const meta = new SlashCommandBuilder()
  .setName("bans")
  .setDescription("Shows a list of banned users");

export default command(meta, async ({ interaction }) => {
  const user = interaction.guild?.members.cache.get(interaction.user.id);

  if (!user?.permissions.has([PermissionsBitField.Flags.BanMembers])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const gid = interaction.guild?.id;

  const bans = await punishment.find({ gid, type: "ban" });
  const embeds: any[] = [];
  for (let ban of bans) {
    const user = interaction.client.users.cache.get(ban.uid);
    const mod = interaction.guild?.members.cache.get(ban.modId);
    const expire = ban.expires - new Date().getTime();
    const footer: APIEmbedFooter = { text: `Expires in ${expire} seconds` };
    if (user)
      embeds.push(
        embed({
          title: user.tag,
          description: `Baned for **${ban.reason}** by ${mod?.user.tag}\nuid: ${ban.uid}`,
          footer,
        })
      );
  }

  if (embeds.length === 0) {
    return interaction.reply({
      ephemeral: true,
      embeds: [
        embed({
          color: Colors.success,
          title: "Bans",
          description: "No bans",
        }),
      ],
    });
  }

  return interaction.reply({
    ephemeral: true,
    embeds: [...embeds],
  });
});
