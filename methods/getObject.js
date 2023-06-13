import { Activity } from "../schema/index.js";
export default async function handler(id) {
  let object = await Activity.findOne({ "object.id": id });
  if (object) object = object.object;
  if (!object && typeof object == "string" && object.length > 0)
    object = (await (await fetch(id)).json()).object;
  // console.log(object);
  return object;
}
