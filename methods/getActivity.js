import { Activity } from "../schema/index.js";
import util from "util";
function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
export default async function handler(id) {
  let query = { $and: [] };
  if (isValidHttpUrl(id)) {
    query.$and.push({ id: id });
  } else {
    query.$and.push({ _id: id });
  }

  if (!this.user) {
    query.$and.push({ public: true });
  } else {
    query.$and.push({
      $or: [
        { public: true },
        { actor: this.user.id },
        { to: this.user.id },
        { bto: this.user.id },
        { cc: this.user.id },
        { bcc: this.user.id },
      ],
    });
  }
  // if (this.user)
  //   query.$and[1] = {
  //     $or: [
  //       { public: true },
  //       { actor: this.user.id },
  //       { to: this.user.id },
  //       { bto: this.user.id },
  //       { cc: this.user.id },
  //       { bcc: this.user.id },
  //     ],
  //   };

  console.log(
    util.inspect(query, { showHidden: false, depth: null, colors: true })
  );

  let activity = await Activity.findOne(query);
  // if (!activity) activity = await (await fetch(id)).json();
  return this.sanitize(activity);
}
