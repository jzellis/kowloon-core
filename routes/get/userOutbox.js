import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  let status = 200;
  let response = {};
  let page = req.query.page || 1;
  // let query = {
  //   actor: req.params.id,
  //   public: true,
  // };
  let query = req.user
    ? {
        actor: req.params.id,
        $or: [
          { public: true },
          { to: req.user.actor },
          { cc: req.user.actor },
          { bcc: req.user.actor },
          { bto: req.user.actor },
        ],
      }
    : {
        actor: req.params.id,
        public: true,
      };
  let posts = await Kowloon.queryPosts(query, page);
  response = {
    "@context": "https://www.w3.org/ns/activitystreams",
    summary: `${req.params.id} | Public Posts`,
    type: "OrderedCollection",
    totalItems: posts.length,
    items: posts,
  };
  res.status(status).json(response);
}
