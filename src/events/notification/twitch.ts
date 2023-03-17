import { Collection, Guild, OAuth2Guild, TextChannel } from "discord.js";
import TwitchApi from "node-twitch";
import { notificationI } from "../../types";

export async function twitchRun(
  streamer: string,
  twitch: TwitchApi,
  guild: OAuth2Guild | Guild,
  isExist: notificationI,
  collection: Collection<any, NodeJS.Timer>
) {
  let IsLiveMemory = false;
  const interval = setInterval(() => Run(streamer), 30000);
  collection.set(guild.id + streamer, interval);
  async function Run(channel: string) {
    await twitch
      .getStreams({ channel })
      .then(async (data) => {
        const r = data.data[0];
        const ChannelAnnounceLive = guild.client.channels.cache.find(
          (x) => x.id === isExist?.channelTwitch
        );

        if (!r) {
          IsLiveMemory = false;
          isExist.live = isExist.live.filter((e) => e !== streamer);
          await isExist.save();
          return;
        }

        if (r.type === "live") {
          if (
            (IsLiveMemory === false && !isExist.live.includes(streamer)) ||
            (IsLiveMemory === undefined && !isExist.live.includes(streamer))
          ) {
            IsLiveMemory = true;
            isExist.live.push(streamer);
            await isExist.save();
            (ChannelAnnounceLive as TextChannel).send({
              content: `${isExist?.messageTwitch.replace(
                "LINK",
                `https://www.twitch.tv/${streamer}`
              )}`,
            });
          }
        } else {
          IsLiveMemory = false;
          isExist.live = isExist.live.filter((e) => e !== streamer);
          await isExist.save();
        }
      })
      .catch(() => null);
  }
}

export function twitchRemove(
  guild: Guild,
  streamer: string,
  collection: Collection<any, NodeJS.Timer>
) {
  const interval = collection.get(guild.id! + streamer);
  clearInterval(interval);
}

// import { Collection, PermissionsBitField, TextChannel } from "discord.js";
// import { Colors, CustomId, embed, event } from "../../utils";
// import models from "../../models";
// import TwitchApi from "node-twitch";
// import Keys from "../../keys";
// const { notification } = models;
// const intervals = new Collection<any, NodeJS.Timer>();

// const twitch = new TwitchApi({
//   client_id: Keys.twitch_client_id,
//   client_secret: Keys.twitch_client_secret,
// });

// const ready = event("ready", async ({ log }, client) => {
//   const guilds = await client.guilds.fetch();
//   for (let guild of guilds) {
//     const gid = guild[1].id;
//     const isExist = await notification.findOne({ gid });

//     if (isExist) {
//       for (let streamer of isExist.twitch) {
//         let IsLiveMemory = false;
//         setInterval(() => Run(streamer), 30000);
//         async function Run(channel: string) {
//           await twitch
//             .getStreams({ channel })
//             .then(async (data) => {
//               const r = data.data[0];
//               const ChannelAnnounceLive = guild[1].client.channels.cache.find(
//                 (x) => x.id === isExist?.channelId
//               );
//               if (r !== undefined) {
//                 if (r.type === "live") {
//                   if (IsLiveMemory === false || IsLiveMemory === undefined) {
//                     IsLiveMemory = true;
//                     (ChannelAnnounceLive as TextChannel).send({
//                       content: `${isExist?.messageTwitch.replace(
//                         "LINK",
//                         `https://www.twitch.tv/${streamer}`
//                       )}`,
//                     });
//                   } else if (IsLiveMemory === true) {
//                   } else {
//                   }
//                 } else {
//                   IsLiveMemory = false;
//                 }
//               }
//             })
//             .catch(() => null);
//         }
//       }
//     }
//   }
// });

// const interactionCreate = event(
//   "interactionCreate",
//   async ({ log }, interaction) => {
//     const gid = interaction.guild?.id;

//     if (interaction.isCommand()) {
//       if (interaction.commandName === "twitch-add") {
//         const isExist = await notification.findOne({ gid });
//         const streamer = interaction.options.get("twitch")?.value as string;
//         if (!isExist?.twitch.includes(streamer)) {
//           let IsLiveMemory = false;
//           const interval = setInterval(() => Run(streamer), 30000);
//           intervals.set(gid + streamer, interval);
//           async function Run(channel: string) {
//             await twitch
//               .getStreams({ channel })
//               .then(async (data) => {
//                 const r = data.data[0];
//                 const ChannelAnnounceLive =
//                   interaction.guild?.channels.cache.find(
//                     (x) => x.id === isExist?.channelId
//                   );
//                 if (r !== undefined) {
//                   if (r.type === "live") {
//                     if (IsLiveMemory === false || IsLiveMemory === undefined) {
//                       IsLiveMemory = true;
//                       (ChannelAnnounceLive as TextChannel).send({
//                         content: `${isExist?.messageTwitch.replace(
//                           "LINK",
//                           `https://www.twitch.tv/${streamer}`
//                         )}`,
//                       });
//                     } else if (IsLiveMemory === true) {
//                     } else {
//                     }
//                   } else {
//                     IsLiveMemory = false;
//                   }
//                 }
//               })
//               .catch(() => null);
//           }
//         }
//       }
//       if (interaction.commandName === "twitch-remove") {
//         const isExist = await notification.findOne({ gid });
//         if (isExist) {
//           const streamer = interaction.options.get("username");
//           if (!streamer) return;

//           const interval = intervals.get(gid! + streamer);
//           clearInterval(interval);
//         }
//       }
//     }
//     if (interaction.isStringSelectMenu()) {
//       if (interaction.customId === CustomId.twitchRemove) {
//         const userExec = await interaction.guild?.members.fetch(
//           interaction.user.id
//         );
//         if (
//           !userExec?.permissions.has([PermissionsBitField.Flags.ManageChannels])
//         ) {
//           return interaction.reply({
//             ephemeral: true,
//             content: `Insufficient permission`,
//           });
//         }

//         const isExist = await notification.findOne({ gid });
//         if (isExist) {
//           isExist.twitch = isExist.twitch.filter(
//             (e) => e !== interaction.values[0]
//           );
//           await isExist.save();
//           const interval = intervals.get(gid + interaction.values[0]);
//           clearInterval(interval);
//           return interaction.message.edit({
//             embeds: [
//               embed({
//                 title: "Streamer deleted",
//                 description: `**${interaction.values[0]}** has been deleted`,
//                 color: Colors.success,
//               }),
//             ],
//             components: [],
//           });
//         }

//         return interaction.reply({
//           embeds: [
//             embed({
//               title: "Error",
//               description: `Can't detele user, something went wrong`,
//             }),
//           ],
//         });
//       }
//       return;
//     }
//   }
// );

// export default [interactionCreate, ready];
