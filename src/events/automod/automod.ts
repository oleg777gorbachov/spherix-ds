import { embed, event, isIncludeLink, stringSplit } from "../../utils";
import models from "../../models";
import { TextChannel } from "discord.js";
import EmojiRegex from "emoji-regex";
const { automod } = models;

const messageCache: Map<string, string> = new Map();
const messageRecent: Map<string, number> = new Map();

const interactionCreate = event(
  "messageCreate",
  async ({ log }, interaction) => {
    const gid = interaction.guild?.id;
    const model = await automod.findOne({ gid });
    const message: string = interaction.content;
    const uid = interaction.author.id;
    const channel = interaction.channel as TextChannel;

    if (
      !model ||
      !model.state ||
      interaction.author.bot ||
      model.whitelist.includes(uid)
    )
      return;

    if (model.spam) {
      const maxDuplicates = 3;
      const spamInterval = 800;

      const lastMessage = messageRecent.get(uid);
      const currentTimestamp = Date.now();
      messageRecent.set(uid, currentTimestamp);
      const duplicate = messageRecent.get(uid + "-duplicates") || 0;

      if (
        typeof lastMessage === "number" &&
        currentTimestamp - lastMessage < spamInterval
      ) {
        messageRecent.set(uid + "-duplicates", duplicate + 1);
        if (duplicate >= maxDuplicates) {
          await interaction.delete();
          return channel.send({
            embeds: [
              embed({
                title: "⚔️ Automod",
                description: stringSplit([
                  `${interaction.author} has break the rules`,
                  `Reason: **spam**`,
                ]),
              }),
            ],
          });
        }
      } else {
        const duplicate = messageRecent.get(uid + "-duplicates") || 1;
        if (duplicate >= 0) {
          messageRecent.set(uid + "-duplicates", duplicate - 1);
        }
      }
    }

    if (model.caps) {
      const caps = message.replace(/[^A-Z]/g, "").length;
      const total = message.length;
      const capsPercentage = caps / total;

      if (capsPercentage > 0.7) {
        await interaction.delete();
        return channel.send({
          embeds: [
            embed({
              title: "⚔️ Automod",
              description: stringSplit([
                `${interaction.author} has break the rules`,
                `Reason: **caps**`,
              ]),
            }),
          ],
        });
      }
    }

    if (model.badwords) {
      const message = interaction.content.toLowerCase();
      for (let word of model.words) {
        if (message.includes(word)) {
          const id = interaction.author.id;
          for (let role of model.whitelist) {
            const r = interaction.guild?.members.cache
              .get(id)
              ?.roles.cache.find((r) => r.id === role);
            if (r) return;
          }
          await interaction.delete();
          return (interaction.channel as TextChannel).send({
            embeds: [
              embed({
                title: `⚔️ Automod`,
                description: `${interaction.author} used a forbidden word`,
              }),
            ],
          });
        }
      }
    }

    if (model.duplicateText) {
      const recentMessages = Array.from(messageCache.values()).slice(0, 5);
      if (recentMessages.includes(interaction.content)) {
        // Message is a duplicate
        await interaction.delete();
        return channel.send({
          embeds: [
            embed({
              title: `⚔️ Automod`,
              description: `${interaction.author} dulpicate message`,
            }),
          ],
        });
      }
      messageCache.set(interaction.id, interaction.content);
      // Remove the oldest message from the cache if there are more than 10 messages
      if (messageCache.size > 10) {
        const oldestMessage = Array.from(messageCache.keys())[0];
        messageCache.delete(oldestMessage);
      }
    }

    if (model.invites) {
      if (message.includes("discord.gg/")) {
        await interaction.delete();
        return channel.send({
          embeds: [
            embed({
              title: `⚔️ Automod`,
              description: `${interaction.author} send link to discord server`,
            }),
          ],
        });
      }
    }

    if (model.links) {
      if (isIncludeLink(message, model.whitelistlinks)) {
        await interaction.delete();
        return channel.send({
          embeds: [
            embed({
              title: `⚔️ Automod`,
              description: `${interaction.author} send link`,
            }),
          ],
        });
      }
    }

    if (model.mention) {
      const hereRole = interaction.guild?.roles.cache.find(
        (role) => role.name === "here"
      );

      if (
        interaction.mentions.everyone ||
        (hereRole && interaction.mentions.roles.has(hereRole.id))
      ) {
        await interaction.delete();
        return channel.send({
          embeds: [
            embed({
              title: `⚔️ Automod`,
              description: `${interaction.author} tags a big amount of users`,
            }),
          ],
        });
      }
    }

    if (model.emoji) {
      const threshold = model.maxEmoji;

      const emojis = message.match(EmojiRegex()) || [];

      if (emojis.length > threshold) {
        await interaction.delete();
        return channel.send({
          embeds: [
            embed({
              title: `⚔️ Automod`,
              description: `${interaction.author} spams emoji`,
            }),
          ],
        });
      }
    }
  }
);

export default interactionCreate;
