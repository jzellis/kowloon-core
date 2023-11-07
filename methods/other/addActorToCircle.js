import { Actor, Circle } from "../../schema/index.js";

export default async function (circleID, actorID) {
  const actor = await Actor.findOne({ id: actorID });
  const circle = await Circle.findOneAndUpdate(
    { _id: circleID },
    { $push: { members: actor.id } }
  );
  return circle;
}
