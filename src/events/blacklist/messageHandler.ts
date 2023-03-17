import { TextChannel } from "discord.js";
import { embed, event } from "../../utils";
import models from "../../models";
const { blacklist } = models;

const create = event("messageCreate", async ({ log }, client) => {
  if (client.author.bot) return;
  const gid = client.guild?.id;

  if (gid) {
    const isExist = await blacklist.findOne({ gid });
    if (isExist?.words) {
      const message = client.content.toLowerCase();
      for (let word of isExist.words) {
        if (message.includes(word)) {
          const id = client.author.id;
          for (let role of isExist.whitelist) {
            const r = client.guild.members.cache
              .get(id)
              ?.roles.cache.find((r) => r.id === role);
            if (r) return;
          }
          (client.channel as TextChannel).send({
            embeds: [
              embed({
                title: `Bad word warning`,
                description: `${client.author} used a forbidden word`,
              }),
            ],
          });
          return client.delete();
        }
      }
    }
  }
});

const update = event("messageUpdate", async ({ log }, oldClient, client) => {
  if (client.author?.bot) return;
  const gid = client.guild?.id;
  if (gid) {
    const isExist = await blacklist.findOne({ gid });
    if (isExist?.words && client.content && client.author) {
      const message = client.content.toLowerCase();
      for (let word of isExist.words) {
        if (message.includes(word)) {
          const id = client.author.id;
          for (let role of isExist.whitelist) {
            const r = client.guild.members.cache
              .get(id)
              ?.roles.cache.find((r) => r.id === role);
            if (r) return;
          }
          (client.channel as TextChannel).send({
            embeds: [
              embed({
                title: `Bad word warning`,
                description: `${client.author} used a forbidden word`,
              }),
            ],
          });
          return client.delete();
        }
      }
    }
  }
});

export default [update, create];
