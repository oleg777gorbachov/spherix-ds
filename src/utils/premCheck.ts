import { CacheType, ChatInputCommandInteraction } from "discord.js";
import models from "../models";
import { stringSplit } from ".";
const { premium } = models;

export async function premCheck(
  interaction: ChatInputCommandInteraction<CacheType>,
  stop: boolean = true
): Promise<boolean> {
  const gid = interaction.guildId;
  const model = await premium.findOne({ gid });

  if (stop) {
    if (!model || !model.state) {
      interaction.reply({
        ephemeral: true,
        content: stringSplit([
          `You don't have premium subscribe to use this command.`,
          `To buy premium click **LINK TO BUY**`,
        ]),
      });
      return false;
    }
  }
  return true;
}
