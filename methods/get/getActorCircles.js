import Kowloon from "../../kowloon";

/**
 * @namespace kowloon
 */
export default async function (actorId, options = { populate: [] }) {
  try {
    let query = {
      members: actorId,
    };
    await Kowloon._getCircles(query, options);
  } catch (error) {
    console.log(error);
    return { error };
  }
}
