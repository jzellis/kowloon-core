import { Inbox } from "../schema/index.js";
export default async function handler({
  to,
  actors,
  showMine,
  types,
  read,
  page,
}) {
  types = types || ["Note", "Activity", "Image", "Link"];
  let q = { to, "activity.inReplyTo": { $exists: false } };
  if (read) q.read = read;
  if (!showMine || showMine == false) q["activity.actor"] = { $ne: to };
  if (actors && typeof actors === "array")
    q["activity.actor"] = { $in: actors };
  page = page || 1;
  let limit = 10;
  console.log(q);
  let items = await Inbox.find(q, "activity")
    .sort("-received")
    .skip((page - 1) * limit)
    .limit(limit);
  items = await Promise.all(
    items.map(async (i, idx) => {
      i.activity.object = await this.getObject(i.activity.object);
      if (types.indexOf(i.activity.object.type) == -1) return false;
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
  return items.filter((e) => e != false);
}
