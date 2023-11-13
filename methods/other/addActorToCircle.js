import { Actor, Circle } from "../../schema/index.js";

export default async function (circleID, actorID) {
  try {
    const actor = await Actor.findOne({ id: actorID });
    const circle = await Circle.findOneAndUpdate(
      { _id: circleID },
      { $push: { members: actor.id } }
    );
    return { actor, circle };
  } catch (error) {
    return { error };
  }
}
