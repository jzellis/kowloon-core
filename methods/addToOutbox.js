import { Activity, User, Outbox } from "../schema/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const methodDir = __dirname + "/outbox/";

const OutboxParser = {};

const verbs = await fs.readdirSync(methodDir);
for (let j = 0; j < verbs.length; j++) {
  let file = verbs[j];
  if (!fs.lstatSync(methodDir + file).isDirectory()) {
    let name = file.split(".js")[0];
    let imported = await import(`${methodDir}${file}`);
    let importedMethod = imported.default;
    Object.defineProperty(OutboxParser, name, {
      enumerable: true,
      configurable: true,
      value: importedMethod,
    });
  }
}

export default async function handler(activity) {
  activity.owner = activity.owner || this.user ? this.user._id : undefined;
  let owner = await User.findOne({ _id: activity.owner });
  if (!owner) return { error: "No owner found" };
  activity.actor = owner.actor.id;
  if (activity.public == true && !activity.inReplyTo)
    activity.cc =
      activity.cc && activity.cc.length > 0
        ? activity.cc.concat(owner.actor.followers.items)
        : owner.actor.followers.items;
  if (activity.cc) {
    activity.cc.push(activity.actor);
  } else {
    activity.cc = [activity.actor];
  }
  try {
    activity = await Activity.create(activity);

    if (OutboxParser[activity.type]) {
      await OutboxParser[activity.type](activity);
    }

    let recipients = activity.getRecipients();

    let outboxItems = [];
    if (recipients.length > 0) {
      await Promise.all(
        recipients.map(async (recipient) => {
          if (activity.object)
            activity.object = activity.object.id || activity.object;
          activity.bto =
            activity.cc =
            activity.bcc =
            activity.whoCanComment =
            activity.owner =
            activity._id =
              undefined;
          const outboxItem = {
            from: activity.actor,
            to: recipient,
            activity: activity,
          };

          try {
            let actor = await this.getActor(recipient);
            try {
              outboxItem.response = await (
                await fetch(actor.inbox, {
                  method: "POST",
                  headers: {
                    "Content-Type": `application/json`,
                  },
                  body: JSON.stringify(outboxItem),
                })
              ).json();
              outboxItem.delivered = new Date().toISOString();
            } catch (e) {
              console.log("Fetching inbox URL ", actor.inbox, " failed");
            }
          } catch (e) {
            console.error(e);
            outboxItem.error = e;
          }
          if (activity.type != "Read") outboxItems.push(outboxItem);
        })
      );
    }
    await Outbox.create(outboxItems);
  } catch (e) {
    console.log(e);
  }
  return this.sanitize(activity);
}
