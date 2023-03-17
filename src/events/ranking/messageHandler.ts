import { event } from "../../utils";
import models from "../../models";
const { ranks } = models;

export default event("messageCreate", async ({ log }, client) => {
  const gid = client.guild?.id;
  const uid = client.member?.id;
  if (gid && !client.member?.user.bot && uid) {
    const message = client.content;
    const rank = await ranks.findOne({ gid, uid });
    if (rank) {
      rank.messages++;
      rank.messagesLength = rank.messagesLength + message.length;
      await rank.save();
    } else {
      await new ranks({
        gid,
        uid,
        voice: 0,
        messages: 1,
        messagesLength: message.length,
      }).save();
    }
  }
});
