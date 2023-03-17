import { InteractionReplyOptions, WebhookEditMessageOptions } from "discord.js";
import { Colors } from "./color/colors";

export const Reply = {
  error(msg: string): InteractionReplyOptions {
    return {
      ephemeral: true,
      embeds: [
        {
          color: Colors.error,
          description: msg,
        },
      ],
    };
  },
};

export const EditReply = {
  error(msg: string): WebhookEditMessageOptions {
    return {
      embeds: [
        {
          color: Colors.error,
          description: msg,
        },
      ],
    };
  },
};
