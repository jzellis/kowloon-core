import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon._setUser(req.user);
  let status = 200;
  let response = {};
  let query = { public: true, deleted: { $exists: false } };
  if (req.user && req.user.actor && req.user.actor.id) {
    query = {
      ...query,
      $or: [
        { to: req.user.actor.id },
        { cc: req.user.actor.id },
        { bcc: req.user.actor.id },
        { audience: req.user.actor.id },
      ],
    };
  }
  let page = req.query.page || 1;

  let posts = await Kowloon.queryPosts(query, page);
  response = {
    "@context": "https://www.w3.org/ns/activitystreams",
    summary: `${Kowloon.settings.title} | public posts`,
    type: "OrderedCollection",
    totalItems: posts.count,
    page,
    items: posts,
  };

  res.status(status).json(response);
}
