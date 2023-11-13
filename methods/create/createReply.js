export default async function (activity) {
  try {
    const regex = new RegExp("^[aeiou].*", "i");
    const actor = await this._getActor(activity.actor);
    const originalPost = await this._getPost(activity.target);
    let summary = `${actor.name} replied to ${
      post.object.type.test(regex) ? "an" : "a"
    } ${originalPost.object.type}`;
    activity = { ...activity, summary };
    return this.sanitize(activity);
  } catch (error) {
    return { error };
  }
}
