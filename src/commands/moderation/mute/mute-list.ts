import {
  APIEmbedFooter,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { Colors, command, embed } from "../../../utils";
import models from "../../../models";

const { punishment } = models;

const meta = new SlashCommandBuilder()
  .setName("mutes")
  .setDescription("Shows a list of muted users");

export default command(meta, async ({ interaction }) => {
  const user = interaction.guild?.members.cache.get(interaction.user.id);

  if (!user?.permissions.has([PermissionsBitField.Flags.MuteMembers])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const gid = interaction.guild?.id;

  const mutes = await punishment.find({ gid, type: "mute" });
  const embeds: any[] = [];

  for (let mute of mutes) {
    const user = interaction.client.users.cache.get(mute.uid);
    const mod = interaction.guild?.members.cache.get(mute.modId);
    const expire = mute.expires - new Date().getTime();
    const footer: APIEmbedFooter = { text: `Expires in ${expire} seconds` };
    if (user)
      embeds.push(
        embed({
          title: user.tag,
          description: `Muted for **${mute.reason}** by ${mod?.user.tag}`,
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
          title: "Mutes",
          description: "No mutes",
        }),
      ],
    });
  }

  return interaction.reply({
    ephemeral: true,
    embeds: [...embeds],
  });
});
