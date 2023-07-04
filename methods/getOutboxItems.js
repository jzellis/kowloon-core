import { Outbox } from "../schema/index.js";
export default async function handler(q) {
  console.log(q);
  let items = await Outbox.find(q, "activity").sort("-createdAt");
  items = await Promise.all(
    items.map(async (i, idx) => {
      i.activity.object = await this.getObject(i.activity.object);
      if (!i.activity.object || types.indexOf(i.activity.object.type) == -1)
        return false;
      i.activity.actor = await this.getActor(i.activity.actor);
      i.activity.object.actor = await this.getActor(i.activity.object.actor);
      i.activity.object.replies.items = await Promise.all(
        i.activity.object.replies.items.map(async (r, i) => {
          console.log("Reply: ", r);
          let reply = await this.getObject(r);
          reply.actor = await this.getActor(reply.actor);
          return reply;
        })
      );

      return i.activity;
    })
  );
  return items.filter((e) => e != false).map((i) => i.activity);
}
