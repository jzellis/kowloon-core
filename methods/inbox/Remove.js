import { Activity, User, Settings } from "../../schema/index.js";
export default async function handler(activity) {
  let _this = this;
  const target = activity.target;
  let result;
  switch (true) {
    case target.type == "circle":
      result = await User.findOneAndUpdate(
        { _id: owner._id, "actor.circles.items._id": target.id },
        {
          $pull: { "$.items": activity.object },
        }
      );
      break;
  }

  switch (true) {
    case target.type == "bookmark":
      result = await User.findOneAndUpdate(
        { _id: owner._id, "actor.bookmark.items._id": target.id },
        {
          $pull: { "$.items": activity.object },
        }
      );
      break;
  }
  activity.result = result;
  return _this.sanitize(activity);
}
