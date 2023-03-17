import commands from "../commands";
import { Command } from "../types";
import { Colors, EditReply, embed, event, Reply } from "../utils";
import models from "../models";
const { notification } = models;

const allCommands = commands.map(({ commands }) => commands).flat();
const allCommandsMap = new Map<string, Command>(
  allCommands.map((c) => [c.meta.name, c])
);

export default event(
  "interactionCreate",
  async ({ log, client }, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
      const commandName = interaction.commandName;
      const command = allCommandsMap.get(commandName);

      if (!command) throw new Error("Command not found ...");

      await command.exec({
        client,
        interaction,
        log(...args) {
          log(`[${command.meta.name}]`, ...args);
        },
      });
    } catch (error) {
      log("[Command Error]", error);

      if (interaction.deferred) {
        return interaction.editReply(EditReply.error("Something went wrong"));
      }

      return interaction.reply(Reply.error("Something went wrong"));
    }
  }
);
