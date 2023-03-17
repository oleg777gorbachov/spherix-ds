import { Collection, PermissionsBitField } from "discord.js";
import { Colors, CustomId, embed, event } from "../../utils";
import models from "../../models";
import TwitchApi from "node-twitch";
import Keys from "../../keys";
import { twitchRemove, twitchRun } from "./twitch";
import { youtubeRemove, youtubeRun } from "./youtube";
const { notification } = models;
const intervals = new Collection<any, NodeJS.Timer>();

const twitch = new TwitchApi({
  client_id: Keys.twitch_client_id,
  client_secret: Keys.twitch_client_secret,
});

const ready = event("ready", async ({ log }, client) => {
  const guilds = await client.guilds.fetch();
  for (let guild of guilds) {
    const gid = guild[1].id;
    const isExist = await notification.findOne({ gid });

    if (!isExist) continue;

    for (let streamer of isExist.twitch) {
      await twitchRun(streamer, twitch, guild[1], isExist, intervals);
    }
    for (let id of isExist.youtube) {
      await youtubeRun(id, guild[1], isExist, intervals);
    }
  }
});

const interactionCreate = event(
  "interactionCreate",
  async ({ log }, interaction) => {
    const gid = interaction.guild?.id;

    // COMMANDS
    if (interaction.isCommand()) {
      // TWITCH
      if (interaction.commandName === "twitch-add") {
        const isExist = await notification.findOne({ gid });
        const streamer = interaction.options.get("twitch")?.value as string;
        if (!isExist) return;

        if (!isExist.twitch.includes(streamer)) {
          await twitchRun(
            streamer,
            twitch,
            interaction.guild!,
            isExist,
            intervals
          );
        }
      }
      if (interaction.commandName === "twitch-remove") {
        const isExist = await notification.findOne({ gid });
        const streamer = interaction.options.get("username")?.value as string;

        if (!isExist || !streamer) return;

        twitchRemove(interaction.guild!, streamer, intervals);
      }
      // YOUTUBE
      if (interaction.commandName === "youtube-add") {
        const isExist = await notification.findOne({ gid });
        const id = interaction.options.get("youtube_id")?.value as string;
        if (!isExist) return;

        if (!isExist.youtube.includes(id)) {
          await youtubeRun(id, interaction.guild!, isExist, intervals);
        }
      }
      if (interaction.commandName === "youtube-remove") {
        const isExist = await notification.findOne({ gid });
        const id = interaction.options.get("youtube_id")?.value as string;

        if (!isExist || !id) return;

        youtubeRemove(id, interaction.guild!, intervals);
      }
    }
    // SELECTABLE MENU
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === CustomId.twitchRemove) {
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

        const isExist = await notification.findOne({ gid });

        const streamer = interaction.values[0];
        if (isExist && isExist.twitch) {
          isExist.twitch = isExist.twitch.filter((e) => e !== streamer);
          await isExist.save();
          twitchRemove(interaction.guild!, streamer, intervals);
          return interaction.message.edit({
            embeds: [
              embed({
                title: "Streamer deleted",
                description: `**${streamer}** has been deleted`,
                color: Colors.success,
              }),
            ],
            components: [],
          });
        }

        return interaction.reply({
          embeds: [
            embed({
              title: "Error",
              description: `Can't detele user, something went wrong`,
            }),
          ],
        });
      }
      if (interaction.customId === CustomId.youtubeRemove) {
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

        const isExist = await notification.findOne({ gid });
        const id = interaction.values[0];

        if (isExist && isExist.youtube) {
          isExist.youtube = isExist.youtube.filter((e) => e !== id);
          await isExist.save();
          youtubeRemove(id, interaction.guild!, intervals);
          return interaction.message.edit({
            embeds: [
              embed({
                title: "Streamer deleted",
                description: `**${id}** has been deleted`,
                color: Colors.success,
              }),
            ],
            components: [],
          });
        }

        return interaction.reply({
          embeds: [
            embed({
              title: "Error",
              description: `Can't detele user, something went wrong`,
            }),
          ],
        });
      }
    }
  }
);

export default [interactionCreate, ready];
