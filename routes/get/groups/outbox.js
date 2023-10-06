import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon.setUser(req.user);
  let group = await Kowloon.getGroupById(req.params.id);
  let status = 200;
  let response = {};

  let page = req.query.page || 1;

  let posts = await Kowloon.queryPosts(
    {
      $or: [
        { to: group.id },
        { cc: group.id },
        { bto: group.id },
        { bcc: group.id },
      ],
      public: true,
      deleted: { $exists: false },
    },
    page
  );
  response = {
    "@context": "https://www.w3.org/ns/activitystreams",
    summary: `${group.name} | public posts`,
    type: "OrderedCollection",
    totalItems: posts.count,
    page,
    items: posts,
  };
  res.status(status).json(response);
}
