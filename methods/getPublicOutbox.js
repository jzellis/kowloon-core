import { Activity } from "../schema/index.js";
export default async function handler(page) {
  page = page || 1;
  let items = 20;
  let posts = await Activity.find(
    { public: true, "object.deleted": { $exists: false } },
    "-__v -whoCanComment -object.bcc -object.bto -content"
  )
    .sort("-published")
    .skip((page - 1) * items)
    .limit(items);
  return posts;
}
