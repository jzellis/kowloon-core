/**
 * @namespace kowloon
 */
export default async function (id, options = { populate: true }) {
  try {
    let activity = await this._getActivity(id);
    if (activity && options.populate === true) {
      switch (activity.type) {
        case "Create" || "Update" || "Bookmark":
          switch (activity.objectType) {
            case "Post":
              activity.object = await this.getPost(activity.object);
              break;
            case "Actor":
              activity.object = await this.getActor(activity.object);
              break;
            case "Circle":
              activity.object = await this.getCircle(activity.object);
              break;
            case "Group":
              activity.object = await this.getGroup(activity.object);
              break;
            default:
              break;
          }
          break;
        case "Like" || "Unlike":
          activity.target = await this.getPost(activity.target);
          break;
        default:
          break;
      }
    }
    return activity;
  } catch (error) {
    return { error };
  }
}
