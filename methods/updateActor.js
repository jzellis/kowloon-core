import Actor from "../schema/actor.js";

export default async function handler(actor) {
  try {
    const updatedActor = await Actor.findOneAndUpdate(
      { id: actor.id },
      { $set: actor }
    );
    await this.createActivity({
      type: "Update",
      actor: updatedGroup.actor,
      object: updatedGroup.actor.id,
      summary: `${updatedGroup.actor} updated their profile`,
    });
    return updatedActor;
  } catch (e) {
    return { error: e };
  }
}
