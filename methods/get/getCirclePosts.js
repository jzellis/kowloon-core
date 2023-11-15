// This gets posts from users in a circle

export default async function (id, page = 1, options = { deleted: false }) {
  try {
    let circle = await this._getCircle(id);
    let query = {
      actor: { $in: circle.members },
    };
    if (Kowloon.user && Kowloon.user.actor) {
      query.$or = [
        { to: Kowloon.user.actor.id },
        { cc: Kowloon.user.actor.id },
        { bto: Kowloon.user.actor.id },
        { bcc: Kowloon.user.actor.id },
      ];
    } else {
      query.public = true;
    }
    if (options.deleted == false) query.deleted = { $exists: false };
    let total = await this._countPosts(query);
    let items = await this._getPosts(query, page);
    return this.sanitize({ page, total, items });
  } catch (error) {
    return { error };
  }
}
