import Activity from "../schema/activity.js";
import Actor from "../schema/actor.js";
import Inbox from "../schema/inbox.js";
import Post from "../schema/post.js";

export default async function handler() {
  let queue = await Inbox.find({ completed: { $exists: false } });

  await Promise.all(
    queue.map(async (q) => {
      let activity = await this.getActivity(q.activity);
      let recipient = await Actor.findOne({ id: q.to });
      if (recipient.blocked.includes(q.from)) {
        q.blocked = true;
      } else {
        await Activity.create(activity);
        q.completed = Date.now();
      }

      q.save();
    })
  );
}
