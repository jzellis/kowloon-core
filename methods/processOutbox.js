import Activity from "../schema/activity.js";
import Actor from "../schema/actor.js";
import Outbox from "../schema/outbox.js";
import Post from "../schema/post.js";

export default async function handler() {
  let queue = await Outbox.find({ completed: { $exists: false } });

  await Promise.all(
    queue.map(async (q) => {
      let activity = await this.getActivity(q.activity);
      let address = `https://${q.to.split("@")[2]}/@${
        q.to.split("@")[1]
      }/inbox`;
      let response = await this.post(address, activity);
      if (!response.error) {
        q.completed = Date.now();
        q.delivered = true;
      } else {
        q.error = response;
      }
      q.save();
    })
  );
}
