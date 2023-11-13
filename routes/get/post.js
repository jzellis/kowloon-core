import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon._setUser(req.user);
  let status = 200;
  let response = {};
  let query = { _id: req.params.id, deleted: { $exists: false } };
  if (Kowloon.user && Kowloon.user.actor) {
    query.$or = [
      { public: true },
      { actor: Kowloon.user.actor.id },
      { attributedTo: Kowloon.user.actor.id },
      { to: Kowloon.user.actor.id },
      { cc: Kowloon.user.actor.id },
      { bto: Kowloon.user.actor.id },
      { bcc: Kowloon.user.actor.id },
    ];
  } else {
    query.public = true;
  }

  let post = await Kowloon.queryPosts(query);
  response = post && post != [] ? post : { error: "Post not found" };
  res.status(status).json(response);
}
