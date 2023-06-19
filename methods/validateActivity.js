import mongoose from "mongoose";
export default function handler(activity) {
  let errors = [];
  switch (true) {
    case !activity.type:
      errors.push("No activity type specified");
      break;

    case !activity.actor:
      errors.push("No actor specified");
      break;

    case activity.type == "Create" && !activity.object:
      errors.push("No object specified");
      break;
  }
  return errors.length > 0 ? { errors } : true;
}
