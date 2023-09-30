import Group from "../schema/group.js";

export default async function handler(group) {
  try {
    const updatedGroup = await Group.findOneAndUpdate(
      { id: group.id },
      { $set: group }
    );
    if (updatedGroup.hidden === false) {
      await this.createActivity({
        type: "Update",
        actor: updatedGroup.actor,
        object: updatedGroup.id,
        summary: `${updatedGroup.actor} updated the group ${updatedGroup.type}`,
      });
    }
    return updatedGroup;
  } catch (e) {
    return { error: e };
  }
}
