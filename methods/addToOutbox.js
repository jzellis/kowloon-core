import { Activity, User, Outbox } from "../schema/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const methodDir = __dirname + "/inbox/";

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
  activity.owner = activity.owner || this.user._id;
  activity = await Activity.create(activity);
  activity = await OutboxParser[activity.type](activity);
  let recipients = activity.getRecipients();
  let outboxItems = [];
  if (recipients.length > 0) {
    await Promise.all(
      recipients.map(async (recipient) => {
        let inbox;
        let actor;
        let error;
        const localUser = await User.findOne({ "actor.id": recipient });
        if (localUser) {
          inbox = receipient + "/inbox/";
        } else {
          try {
            const userReq = await this.fetchGet(recipient);
            let remoteActor = await userReq.json();
            inbox = remoteActor.inbox;
          } catch (e) {
            outboxItem.error = e;
          }
        }
        outboxItem = { activity: activity.id, recipient };
        try {
          let inboxRes = await fetch(inbox, {
            method: "POST",
            headers: {
              "Content-Type": `application/json`,
            },
            body: JSON.stringify(this.sanitize(activity)),
          });
          let inboxResponse = await inboxRes.json();
          outboxItem.response = inboxResponse;
          let delivered = new Date();
          delivered = delivered.toISOString();
          outboxItem.delivered = delivered;
        } catch (e) {
          outboxItem.error = e;
        }
        outboxItems.push(outboxItem);
      })
    );
  }
  await Outbox.create(outboxItems);
  return this.sanitize(activity);
}
