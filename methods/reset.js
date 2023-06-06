import { Activity, User, Inbox, Outbox } from "../schema/index.js";

export default async function handler(options) {
  await Activity.deleteMany({});
  // await User.deleteMany({});
  await Inbox.deleteMany({});
  await Outbox.deleteMany({});
  return true;
}
