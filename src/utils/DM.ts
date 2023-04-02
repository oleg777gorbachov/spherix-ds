import {
  CacheType,
  ChatInputCommandInteraction,
  Client,
  GuildMember,
  MessageCreateOptions,
  MessagePayload,
  User,
} from "discord.js";
import models from "../models";
const { ignore } = models;

export async function DM(
  interaction: ChatInputCommandInteraction<CacheType> | Client<true>,
  options: string | MessagePayload | MessageCreateOptions,
  user: GuildMember | User,
  reminder = false
) {
  const model = await ignore.findOne({ uid: user.id });
  if (!reminder && interaction instanceof ChatInputCommandInteraction) {
    if (model?.isAll || model?.gids.includes(interaction.guild?.id!)) {
      return;
    }
  }
  if (interaction instanceof ChatInputCommandInteraction) {
    return interaction.client.users.send(user, options);
  } else {
    return interaction.users.send(user, options);
  }
}
