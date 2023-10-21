import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon.setUser(req.user);
  let status = 200;
  let response = {};
  let query = { deleted: { $exists: false } };
  if (req.user && req.user.actor && req.user.actor.id) {
    query = {
      ...query,
      $or: [
        { to: req.user.actor.id },
        { cc: req.user.actor.id },
        { bcc: req.user.actor.id },
        { public: true },
        { audience: req.user.actor.id },
      ],
    };
  }
  let page = req.query.page || 1;

  let posts = await Kowloon.queryPosts(query, page);
  // if (typeof posts !== "array") posts = [posts];
  response = {
    "@context": "https://www.w3.org/ns/activitystreams",
    summary: `${Kowloon.settings.title} | public posts`,
    type: "OrderedCollection",
    totalItems: posts.length,
    page,
    items: posts,
  };

  res.status(status).json(response);
}
