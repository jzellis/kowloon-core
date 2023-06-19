import { Inbox } from "../schema/index.js";
export default async function handler(q, page) {
  page = page || 1;
  let limit = 20;
  let items = await Inbox.find(q, "activity")
    .sort("-received")
    .skip((page - 1) * 20)
    .limit(limit);
  return items.map((i) => i.activity);
}
