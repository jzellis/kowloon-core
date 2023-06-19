import { Outbox } from "../schema/index.js";
export default async function handler(q) {
  let items = await Outbox.find(q, "activity").sort("-createdAt");
  return items.map((i) => i.activity);
}
