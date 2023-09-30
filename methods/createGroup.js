import Group from "../schema/group.js";
import Activity from "../schema/activity.js";

export default async function handler(group) {
  if (!group.to || group.to.length === 0) group.to = [group.actor];

  const newGroup = new Group(group);
  const error = newGroup.validateSync();
  if (error) {
    return error;
  } else {
    await newGroup.save();
    if (newGroup.hidden === false) {
      await this.createActivity({
        type: "Create",
        actor: newGroup.actor,
        object: newGroup.id,
        summary: `${newGroup.actor} created a new Group: ${newGroup.name}`,
      });
    }
    return newGroup;
  }
}
