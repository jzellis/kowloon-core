import { Activity } from "../schema/index.js";
export default async function handler(page) {
  page = page || 1;
  let limit = 20;
  let items = await Activity.find(
    {
      type: "Create",
      inReplyTo: { $exists: false },
      public: true,
      "object.deleted": { $exists: false },
    },
    "-__v -whoCanComment -object.bcc -object.bto -content"
  )
    .sort("-published")
    .skip((page - 1) * limit)
    .limit(limit);
  console.log(items);
  items = await Promise.all(
    items.map(async (i, idx) => {
      // if (i.object) i.object = await this.getObject(i.object);
      i.actor = await this.getActor(i.actor);
      if (i.object) i.object.actor = await this.getActor(i.object.actor);
      if (i.object && i.object.replies)
        i.object.replies.items = await Promise.all(
          i.object.replies.items.map(async (r, i) => {
            console.log("Reply: ", r);
            let reply = await this.getObject(r);
            reply.actor = await this.getActor(reply.actor);
            return reply;
          })
        );

      return i;
    })
  );
  return items.filter((e) => e != false);
}
