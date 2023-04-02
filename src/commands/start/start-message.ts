import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { command, embed, replacer, stringSplit } from "../../utils";
import models from "../../models";

const { welcomeRole } = models;

const meta = new SlashCommandBuilder()
  .setName("start-message")
  .setDescription("Sets a welcome message for everyone")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("Your message {NAME - username, SERVER - servername}")
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const message = interaction.options.getString("message") as string;
  const gid = interaction.guild?.id;

  const user = interaction.guild?.members.cache.get(interaction.user.id);

  if (!user?.permissions.has([PermissionsBitField.Flags.ManageGuild])) {
    return interaction.reply({
      ephemeral: true,
      content: `Insufficient permission`,
    });
  }

  const model = await welcomeRole.findOne({ gid });
  if (model) {
    model.message = message;
    await model.save();
  } else {
    await new welcomeRole({
      gid,
      roleId: [],
      message: message,
      messageState: true,
      channelId: "DM",
    }).save();
  }

  const replaced = replacer(message, [
    {
      label: "NAME",
      value: "username#1234",
    },
    {
      label: "SERVER",
      value: interaction.guild?.name!,
    },
  ]);

  return interaction.reply({
    ephemeral: true,
    embeds: [
      embed({
        title: "Welcome message",
        description: stringSplit([
          `New users will be recieve ${
            model && model.channelId !== "DM"
              ? "messages in welcome channel"
              : "DM"
          } (if you want change type /start-channel)`,
          `Your message: `,
          `${replaced}`,
        ]),
      }),
    ],
  });
});
