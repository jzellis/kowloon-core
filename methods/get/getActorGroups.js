import Kowloon from "../../kowloon";

/**
 * @namespace kowloon
 */
export default async function (actorId, options = { populate: [] }) {
  try {
    let query = {
      creator: actorId,
      members: actorId,
    };
    await Kowloon._getGroups(query, options);
  } catch (error) {
    console.log(error);
    return { error };
  }
}
