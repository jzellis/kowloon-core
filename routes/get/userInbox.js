import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  let status = 200;
  let response = {};
  let page = req.query.page || 1;
  console.log(req.params.id);
  let actor = await Kowloon.getActorByUsername(req.params.id);
  let posts = await Kowloon.getActorTimeline(actor.id, page);
  response = {
    "@context": "https://www.w3.org/ns/activitystreams",
    summary: `${req.params.id}'s Public Posts`,
    type: "OrderedCollection",
    totalItems: posts.length,
    items: posts,
  };
  res.status(status).json(response);
}
