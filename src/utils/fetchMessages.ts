import { TextChannel, Message } from "discord.js";

export async function fetchMessages(
  channel: TextChannel,
  iterates: number
): Promise<Message<true>[]> {
  let messagesIterate: number = 0;
  let lastMessage: string;

  const allMessages: Message<true>[] = [];

  while (true) {
    let Messages = await channel.messages.fetch({
      limit: 100,
      before: lastMessage!,
    });
    let last = Messages.last()?.id;
    allMessages.push(...Messages.map((e) => e));
    if (last) lastMessage = last;
    messagesIterate++;
    if (Messages.size != 100 || messagesIterate === iterates) {
      break;
    }
  }
  
  return allMessages;
}
