import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  let status = 200;
  let response = {};
  if (req.user) Kowloon.setUser(req.user);
  let actor = await Kowloon.getActorByUsername(req.params.id);
  if (!Kowloon.user || Kowloon.user.actor.id != actor.id) {
    response = { error: "You are not authorized to view this page" };
  } else {
    let page = req.query.page || 1;

    let posts = await Kowloon.queryPosts(
      {
        $or: [
          { to: Kowloon.user.actor.id },
          { cc: Kowloon.user.actor.id },
          { bto: Kowloon.user.actor.id },
          { bcc: Kowloon.user.actor.id },
        ],
        deleted: { $exists: false },
      },
      page
    );
    response = {
      "@context": "https://www.w3.org/ns/activitystreams",
      summary: `${actor.name} (${actor.id}) | public posts`,
      type: "OrderedCollection",
      totalItems: posts.count,
      page,
      items: posts,
    };
  }

  res.status(status).json(response);
}
