import { Activity } from "../schema/index.js";
import util from "util";

export default async function handler(q, page) {
  page = page || 1;
  let limit = 20;
  if (!this.user) {
    q.public = q.public || true;
  } else {
    q = {
      $and: [
        q,
        {
          $or: [
            { public: true },
            { actor: this.user.id },
            { to: this.user.id },
            { bto: this.user.id },
            { cc: this.user.id },
            { bcc: this.user.id },
          ],
        },
      ],
    };
  }
  q = { ...q, deleted: { $exists: false } };
  console.log(
    util.inspect(q, { showHidden: false, depth: null, colors: true })
  );
  return await Activity.find(q, this.sanitizedFields)
    .sort("-published")
    .skip((page - 1) * 20)
    .limit(limit);
}
