import Kowloon from "../../kowloon.js";

export default async function handler(req, res) {
  console.log(req.user);
  let status = 200;
  let response = {};
  let page = req.query.page || 1;
  let posts = await Kowloon.queryPosts({ public: true }, page);
  response = {
    "@context": "https://www.w3.org/ns/activitystreams",
    summary: `${Kowloon.settings.title} | Public Posts`,
    type: "OrderedCollection",
    totalItems: posts.length,
    items: posts,
  };
  res.status(status).json(response);
}
