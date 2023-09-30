import Group from "../schema/group.js";

export default async function handler(criteria) {
  return this.sanitize(await Group.find(criteria));
}
