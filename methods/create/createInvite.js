import { Invite } from "../../schema/index.js";

export default async function (invite) {
  try {
    return await Invite.create(invite);
  } catch (error) {
    return { error };
  }
}
