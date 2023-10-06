import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon.setUser(req.user);
  let status = 200;
  let response = {};
  let actor = await Kowloon.getActorByUsername(req.params.id);

  let query = {
    $or: [{ actor: actor.id }, { attributedTo: actor.id }],
    deleted: { $exists: false },
  };

  if (
    !Kowloon.user ||
    (Kowloon.user &&
      Kowloon.user.actor &&
      Kowloon.user.actor.id &&
      Kowloon.user.actor.id != actor.id)
  )
    query = { ...query, public: true };

  console.log(query);
  let page = req.query.page || 1;

  let posts = await Kowloon.queryPosts(query, page);
  response = {
    "@context": "https://www.w3.org/ns/activitystreams",
    summary: `${actor.name} (${actor.id}) |${
      query.public == true ? " public" : ""
    } posts`,
    type: "OrderedCollection",
    totalItems: posts.count,
    page,
    items: posts,
  };

  res.status(status).json(response);
}
