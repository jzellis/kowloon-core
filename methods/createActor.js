import Actor from "../schema/actor.js";

export default async function handler(actor) {
  const newActor = new Actor(actor);
  const error = newActor.validateSync();
  if (error) {
    return error;
  } else {
    await newActor.save();
    return newActor;
  }
}
