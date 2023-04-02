import { Colors, DM, embed, event } from "../../utils";
import models from "../../models";

const { reminder } = models;

export default event("ready", ({ log }, client) => {
  reminder.find().then((data) => {
    for (let key of data) {
      const diff = key.expires - new Date().getTime();
      setTimeout(async () => {
        const model = await reminder.findOne({ uid: key.uid, id: key.id });
        if (!model) return;
        const user = client.users.cache.get(key.uid);
        await DM(
          client,
          {
            content: `${user}`,
            embeds: [
              embed({
                color: Colors.success,
                title: "Your remind",
                description: key.message,
              }),
            ],
          },
          user!,
          true
        );
        await key.deleteOne();
      }, diff);
    }
  });
});
