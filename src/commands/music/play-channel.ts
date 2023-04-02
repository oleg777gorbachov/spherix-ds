import { ChannelType, SlashCommandBuilder, VoiceChannel } from "discord.js";
import { command, embed, premCheck, stringSplit } from "../../utils";
import models from "../../models";
const { music } = models;

const meta = new SlashCommandBuilder()
  .setName("play-channel")
  .setDescription("Sets a strict limitations for the bot")
  .addChannelOption((option) =>
    option
      .setName("voice")
      .setDescription("Tag voice channel for the bot")
      .setRequired(true)
  )
  .addChannelOption((option) =>
    option
      .setName("text")
      .setDescription("Tag text channel for the bot")
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option
      .setName("mute")
      .setDescription(
        "Do you want to mute users that's join to voice channel? (Default: true)"
      )
      .setRequired(false)
  );

export default command(meta, async ({ interaction }) => {
  const voice = interaction.options.getChannel("voice");
  const text = interaction.options.getChannel("text");
  const mute = interaction.options.getBoolean("mute");

  const gid = interaction.guild?.id;

  const check = await premCheck(interaction);
  if (!check) return;

  if (voice?.type !== ChannelType.GuildVoice) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong type of voice channel`,
    });
  }

  if (text?.type !== ChannelType.GuildText) {
    return interaction.reply({
      ephemeral: true,
      content: `Wrong type of text channel`,
    });
  }

  const model = await music.findOne({ gid });
  if (model) {
    if (model.muteUsers) {
      const voiceChannel = interaction.guild?.channels.cache.get(model.voiceId);
      await (voiceChannel as VoiceChannel)?.permissionOverwrites.edit(
        interaction.guild?.roles.everyone!,
        {
          Speak: null,
        }
      );
    }

    model.voiceId = voice.id;
    model.channelId = text.id;
    if (mute) model.muteUsers = mute;
    await model.save();
  } else {
    await new music({
      gid,
      voiceId: voice.id,
      channelId: text.id,
      muteUsers: mute || true,
    }).save();
  }

  if (model?.muteUsers) {
    const voiceChannel = interaction.guild?.channels.cache.get(voice.id);
    await (voiceChannel as VoiceChannel)?.permissionOverwrites.edit(
      interaction.guild?.roles.everyone!,
      {
        Speak: false,
      }
    );
  }

  return interaction.reply({
    embeds: [
      embed({
        title: `🎵 Music limitations`,
        description: stringSplit([
          `${voice} set as voice channel for bot`,
          `${text} set as text channel for bot`,
        ]),
      }),
    ],
  });
});
