import Activity from "../schema/activity.js";
import Actor from "../schema/actor.js";
import Post from "../schema/post.js";
import Outbox from "../schema/outbox.js";
import Inbox from "../schema/inbox.js";

export default async function handler(activity) {
  try {
    activity = await Activity.create(activity);

    if (!["Read", "Unread", "View"].includes(activity.type)) {
      let recipients = Array.from(
        new Set([
          ...activity.to,
          ...activity.bto,
          ...activity.cc,
          ...activity.bcc,
        ])
      );

      await Promise.all(
        recipients.map(async (r) => {
          await Outbox.create({
            from: activity.actor,
            to: r,
            server: this.settings.domain,
            activity: activity.id,
          });
        })
      );
    } else {
      await Inbox.findOneAndUpdate(
        { activity: activity.object },
        {
          $set: {
            $read:
              activity.type === "Read" || activity.type === "View"
                ? true
                : false,
          },
        }
      );
    }

    return activity;
  } catch (e) {
    return { error: e };
  }
}
