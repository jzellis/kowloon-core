import { Activity, User, Inbox, Outbox } from "../schema/index.js";
export default async function handler(q) {
  return {
    activities: await Activity.find().count(),
    users: await User.find().count(),
    sent: await Outbox.find().count(),
    received: await Inbox.find().count(),
    newestUser: this.sanitize((await User.findOne().sort("-createdAt")).actor),
    lastLoggedInUser: this.sanitize(
      (await User.findOne().sort("-lastLogin")).actor
    ),
  };
}
