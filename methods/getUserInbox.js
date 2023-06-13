import { Activity, Inbox, User } from "../schema/index.js";

export default async function handler(actor, page = 1) {
  let inboxItems = await Inbox.find(
    {
      to: actor,
      "activity.inReplyTo": { $exists: false },
      "activity.type": "Create",
    },
    "activity"
  )
    .sort("activity.published")
    .limit(100);
  let items = [];

  if (inboxItems.length > 0)
    await Promise.all(
      inboxItems.map(async (a) => {
        a.activity.actor = await this.getActor(a.activity.actor);
        a.activity.object =
          typeof a.activity.object == "string"
            ? await this.getObject(a.activity.object)
            : a.activity.object;
        a.activity.object.actor =
          a.activity.actor.id == a.activity.object.actor
            ? a.activity.actor
            : await this.getActor(a.activity.object.actor);

        if (
          a.activity.object.replies &&
          a.activity.object.replies.items.length > 0
        ) {
          await Promise.all(
            a.activity.object.replies.items.map(async (r, i) => {
              let reply = await this.getObject(r);
              reply.actor = await this.getActor(reply.actor);
              a.activity.object.replies.items[i] = reply;
            })
          );
        }
        items.push(a.activity);
      })
    );

  return items;
}
