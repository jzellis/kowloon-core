/**
 * @namespace kowloon
 */
export default async function (activity) {
  try {
    const regex = new RegExp("^[aeiou].*", "i");
    const actor = await this._getActor(activity.actor);
    const originalPost = await this._getPost(activity.target);
    activity.type = originalPost.likes.includes(activity.object)
      ? "Unlike"
      : "Like";
    if (activity.type === "Like") {
      let summary = `${actor.name} liked ${
        post.object.type.test(regex) ? "an" : "a"
      } ${originalPost.object.type}`;
      activity = { ...activity, summary };
    } else {
      activity.public = false;
    }
    return this.sanitize(await this.createActivity(activity));
  } catch (error) {
    return { error };
  }
}
